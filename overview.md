# GPT Pull Request review Task for Azure Pipelines

This task use GPT model from OpenAI to review Pullrequets and add feedbacks as comments in the Pull Request.


## Compatible with Linux Build Agents

The tasks can execute on all supported build agent operating systems **including Ubuntu and MacOS**.

## Setup

### Give permission to the build service agent

before use this task, make sure that the build service has permissions to contribute to pull requests in your repository

![contribute_to_pr](https://github.com/mlarhrouch/azure-pipeline-gpt-pr-review/blob/main/images/contribute_to_pr.png?raw=true)

### Allow Task to access the system token

#### Yaml pipelines 

Add a checkout section with persistCredentials set to true.

steps:
- checkout: self
  persistCredentials: true

#### Classic editors 

Enable the option "Allow scripts to access the OAuth token" in the "Agent job" properties

![allow_access_token](https://github.com/mlarhrouch/azure-pipeline-gpt-pr-review/blob/main/images/allow_access_token.png?raw=true)