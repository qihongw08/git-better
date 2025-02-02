import * as vscode from 'vscode';
import { Octokit } from "@octokit/core";
import "dotenv/config";

// if (!process.env.GIT_API_KEY) {
//   console.error("Missing API key");
// }

async function getGitHubToken() {
  try {
      // Request GitHub authentication
      const session = await vscode.authentication.getSession('github', ['repo', 'user'], { createIfNone: true });
      return session.accessToken;
  } catch (error) {
      console.error('Error getting GitHub token:', error);
      return undefined;
  }
}

// export const octokit = new Octokit({ auth: process.env.GIT_API_KEY });
// export const octokit = new Octokit({ auth: getGitHubToken().toString() });

let octokit;

try {
  const token = getGitHubToken()?.toString();
  if (!token) {
    throw new Error("GitHub token is missing or invalid");
  }

  octokit = new Octokit({ auth: token });
} catch (error) {
  console.error("Failed to initialize Octokit:", error);
  octokit = null; // or handle it differently based on your needs
}

export { octokit };