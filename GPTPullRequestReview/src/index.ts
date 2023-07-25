import * as tl from "azure-pipelines-task-lib/task";
import { Configuration, OpenAIApi } from 'openai';
import { deleteExistingComments } from './pr';
import { reviewFile } from './review';
import { getTargetBranchName } from './utils';
import { getChangedFiles, initializeGit } from './git';
import https from 'https';

async function run() {
  try {
    if (tl.getVariable('Build.Reason') !== 'PullRequest') {
      tl.setResult(tl.TaskResult.Skipped, "This task should be run only when the build is triggered from a Pull Request.");
      return;
    }

    let openai: OpenAIApi | undefined;
    const supportSelfSignedCertificate = tl.getBoolInput('support_self_signed_certificate');
    const apiKey = tl.getInput('api_key', true);
    const aoiEndpoint = tl.getInput('aoi_endpoint');
    const workingDir = tl.getInput('working_dir');

    if (apiKey == undefined) {
      tl.setResult(tl.TaskResult.Failed, 'No Api Key provided!');
      return;
    }

    if (aoiEndpoint == undefined) {
      const openAiConfiguration = new Configuration({
        apiKey: apiKey,
      });

      openai = new OpenAIApi(openAiConfiguration);
    }

    const git = initializeGit(workingDir ?? tl.getVariable('System.DefaultWorkingDirectory') as string);

    const httpsAgent = new https.Agent({
      rejectUnauthorized: !supportSelfSignedCertificate
    });

    let targetBranch = getTargetBranchName();

    if (!targetBranch) {
      tl.setResult(tl.TaskResult.Failed, 'No target branch found!');
      return;
    }

    const filesNames = await getChangedFiles(git, targetBranch);

    await deleteExistingComments(httpsAgent);

    for (const fileName of filesNames) {
      await reviewFile(git, targetBranch, fileName, httpsAgent, apiKey, openai, aoiEndpoint)
    }

    tl.setResult(tl.TaskResult.Succeeded, "Pull Request reviewed.");
  }
  catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();