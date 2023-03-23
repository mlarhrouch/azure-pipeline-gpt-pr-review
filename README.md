# Review Azure Devops Pull Requests using OpenAi GPT model

## Installation

Installation can be done using [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=mustaphalarhrouch.GPTPullRequestReview).

## Usage

Add the tasks to your build definition.

## Setup

### Give permission to the build service agent

before use this task, make sure that the build service has permissions to contribute to pull requests in your repository

### Allow Task to access the system token

#### Yaml pipelines 

Add a checkout section with persistCredentials set to true.

```yaml
steps:
- checkout: self
  persistCredentials: true
```

#### Classic editors 

Enable the option "Allow scripts to access the OAuth token" in the "Agent job" properties

## Contributions

Found and fixed a bug or improved on something? Contributions are welcome! Please target your pull request against the `main` branch or file an issue on [GitHub](https://github.com/mlarhrouch/azure-pipeline-gpt-pr-review/issues) so someone else can try and implement or fix it. You are also welcome to join our [Discord](https://discord.gg/RpHSpxkEP6) for help and discussions.

## License

[MIT](https://raw.githubusercontent.com/mlarhrouch/azure-pipeline-gpt-pr-review/main/LICENSE)
