import { SimpleGitOptions, SimpleGit, simpleGit } from 'simple-git';
import * as tl from "azure-pipelines-task-lib/task";
import binaryExtensions from 'binary-extensions';
import { getFileExtension } from './utils';

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: `${tl.getVariable('System.DefaultWorkingDirectory')}`,
  binary: 'git'
};

export const git: SimpleGit = simpleGit(gitOptions);

export async function getChangedFiles(targetBranch: string) {
  await git.addConfig('core.pager', 'cat');
  await git.addConfig('core.quotepath', 'false');
  await git.fetch();

  const diffs = await git.diff([targetBranch, '--name-only', '--diff-filter=AMD']);
  const files = diffs.split('\n').filter(line => line.trim().length > 0);
  const deletedDiffs = await git.diff([targetBranch, '--name-only', '--diff-filter=D']);
  const deletedFiles = new Set(deletedDiffs.split('\n').filter(line => line.trim().length > 0));
  const filteredFiles = files.filter(file => !binaryExtensions.includes(getFileExtension(file)) && !deletedFiles.has(file));

  console.log(`Changed Files (excluding binary and deleted files) : \n ${filteredFiles.join('\n')}`);

  return filteredFiles;
}
