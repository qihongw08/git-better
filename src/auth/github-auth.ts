import * as vscode from 'vscode';
import { API, GitExtension } from './git';
import axios from 'axios';

async function authenticateGitHub() {
  const session = await vscode.authentication.getSession(
    'github', 
    ['repo', 'workflow'],
    { createIfNone: true }
  );
  return session.accessToken;
}

function getGitRepo(): API | null {
  const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git');
  return gitExtension?.exports.getAPI(1);
}

function isGitRepository(): boolean {
  const git = getGitRepo();
  return !!git?.repositories[0];
}

async function getPullRequests(accessToken: string) {
  const remoteUrl = await getRemoteOriginUrl();
  const [owner, repo] = parseGitHubUrl(remoteUrl);

  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json'
      }
    }
  );
  
  return response.data;
}

export async function getRemoteOriginUrl(): Promise<string> {
    const git = getGitRepo();
    return git?.repositories[0].state.remotes[0]?.fetchUrl || '';
  }
  
  export function parseGitHubUrl(url: string): [string, string] {
    const match = url.match(/github.com[/:](.*?)\/(.*?)(\.git|$)/);
    return match ? [match[1], match[2]] : ['', ''];
  }
  


