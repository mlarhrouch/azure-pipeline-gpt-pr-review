import fetch from 'node-fetch';
import { git } from './git';
import { OpenAIApi } from 'openai';
import { addCommentToPR } from './pr';
import { Agent } from 'https';

export async function reviewFile(targetBranch: string, fileName: string, httpsAgent: Agent, apiKey: string, openai: OpenAIApi | undefined, aoiEndpoint: string | undefined) {
  console.log(`Start reviewing ${fileName} ...`);

  const patch = await git.diff([targetBranch, '--', fileName]);

  const prompt = `
            Act as a code reviewer of a Pull Request, providing feedback on the code changes below.
            You are provided with the Pull Request changes in a patch format.
            Each patch entry has the commit message in the Subject line followed by the code changes (diffs) in a unidiff format.
            
            As a code reviewer, your task is:
            - Review only added, edited or deleted lines.
            - Non changed code should not be reviewed
            - If there's no bugs, write 'No feedback'.
            - Use bullet points if you have multiple comments.
            
            Patch of the Pull Request to review:
            ${patch}
            `;

  try {
    let choices: any;

    if (openai) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500
      });

      choices = response.data.choices
    }
    else if (aoiEndpoint) {
      const request = await fetch(aoiEndpoint, {
        method: 'POST',
        headers: { 'api-key': `${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 500,
          messages: [{
            role: "user",
            content: prompt
          }]
        })
      });

      const response = await request.json();

      choices = response.choices;
    }

    if (choices && choices.length > 0) {
      const review = aoiEndpoint ? choices[0].message?.content : choices[0].text as string

      if (review.trim() !== "No feedback.") {
        await addCommentToPR(fileName, review, httpsAgent);
      }
    }

    console.log(`Review of ${fileName} completed.`);
  }
  catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}