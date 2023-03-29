# GPT Pull Request review Task for Azure Pipelines

The GPT Pull Request Review Task for Azure Pipelines is designed to use the GPT model from OpenAI to review Pull Requests and provide feedback as comments in the Pull Request.

## Setup

Before using this task, ensure that the build service has permissions to contribute to Pull Requests in your repository, and allow the task to access the system token.

### Give permission to the build service agent

![contribute_to_pr](https://github.com/mlarhrouch/azure-pipeline-gpt-pr-review/blob/main/images/contribute_to_pr.png?raw=true)

### Allow Task to access the system token

Depending on the type of pipeline you are using, follow one of the two steps below:

#### Yaml pipelines 

Add a checkout section with persistCredentials set to true.

```yaml
steps:
- checkout: self
  persistCredentials: true
```

#### Classic editors 

Enable the option "Allow scripts to access the OAuth token" in the "Agent job" properties.

![allow_access_token](https://github.com/mlarhrouch/azure-pipeline-gpt-pr-review/blob/main/images/allow_access_token.png?raw=true)

## How to use it

### Install the extension

To use the GPT Pull Request Review Task, first install the extension in your Azure DevOps organization. Click on the "Get it free" button and follow the prompts to install it. You may need to authorize the extension to access your Azure DevOps account.

### Add the task to the build pipeline

After installing the extension, add the task to your build pipeline. Go to your build pipeline, click on the "+" icon to add a new task, and search for "Review PullRequest by GPT". Select it and add it to your pipeline.

### Configure the task

Once you have added the task to your pipeline, configure it. In the task configuration, provide your API key for OpenAI API. To create an API key, go to https://platform.openai.com/account/api-keys.

### Review Pull Requests

When the build is triggered from a Pull Request, the task will review it. If there is feedback on the changed code, the task will add comments to the Pull Request. If the build is triggered manually, the task will be skipped.

## Compatible with Linux Build Agents

The tasks can execute on all supported build agent operating systems **including Linux and MacOS**.

