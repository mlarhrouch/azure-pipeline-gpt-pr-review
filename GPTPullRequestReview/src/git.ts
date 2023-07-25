import { SimpleGit, simpleGit } from 'simple-git';
import binaryExtensions from 'binary-extensions';
import { getFileExtension } from './utils';

export function initializeGit(baseDir: string): SimpleGit { 
  return simpleGit({ baseDir, binary: 'git' });
}

export async function getChangedFiles(git: SimpleGit, targetBranch: string) {
  await git.addConfig('core.pager', 'cat');
  await git.addConfig('core.quotepath', 'false');
  await git.fetch();

  const diffs = await git.diff([targetBranch, '--name-only', '--diff-filter=AM']);
  const files = diffs.split('\n').filter(line => line.trim().length > 0);
  const nonBinaryFiles = files.filter(file => !binaryExtensions.includes(getFileExtension(file)));

  console.log(`Changed Files (excluding binary files) : \n ${nonBinaryFiles.join('\n')}`);

  return nonBinaryFiles;
}