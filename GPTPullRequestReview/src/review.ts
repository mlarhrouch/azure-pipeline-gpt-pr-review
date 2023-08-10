import fetch from 'node-fetch';
import { git } from './git';
import { OpenAIApi } from 'openai';
import { addCommentToPR } from './pr';
import { Agent } from 'https';

export async function reviewFile(targetBranch: string, fileName: string, httpsAgent: Agent, apiKey: string, openai: OpenAIApi | undefined, aoiEndpoint: string | undefined) {
  console.log(`Start reviewing ${fileName} ...`);

  const patch = await git.diff([targetBranch, '--', fileName]);

  const prompt = 
            tl.getInput('prompt_instructions') + `
            
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
        model: tl.getInput('model') || 'gpt-3.5-turbo',
        messages: [
          {
            "role": "system",
            "content": instructions
          },
          {
            role: "user",
            content: prompt
          }],
        max_tokens: parseInt(tl.getInput('max_tokens') || '500', 10)
      });

      choices = response.data.choices
    }
    else if (aoiEndpoint) {
      const request = await fetch(aoiEndpoint, {
        method: 'POST',
        headers: { 'api-key': `${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: parseInt(tl.getInput('max_tokens') || '500', 10),
          messages: [
            {
              "role": "system",
              "content": instructions
            },
            {
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

      if (!review.replace(/^[\s\-]+/g, '').trim().toLowerCase().startsWith("no feedback")) {
        await addCommentToPR('/' + fileName, review, httpsAgent);
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