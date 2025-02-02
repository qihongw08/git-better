import * as vscode from "vscode";
import { displayInlineComments } from "./views/commentPanel";
//import { startServer } from "./server";
import { CreatePullRequestPanel } from "./CreatePullRequest";
import { EditPullRequestPanel } from "./EditPullRequest";
import { PullRequestProvider } from "./PullRequestProvider";

let token = "";

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pull-request-manager" is now active!')

  const pullRequestProvider = new PullRequestProvider()
  vscode.window.registerTreeDataProvider("pullRequestList", pullRequestProvider)

  const createPRDisposable = vscode.commands.registerCommand("pull-request-manager.createPR", () => {
    CreatePullRequestPanel.createOrShow(context.extensionUri)
  })

  const editPRDisposable = vscode.commands.registerCommand("pull-request-manager.editPR", (prId: string) => {
    EditPullRequestPanel.createOrShow(context.extensionUri, prId)
  })

  const refreshPRDisposable = vscode.commands.registerCommand("pull-request-manager.refreshPRs", () => {
    pullRequestProvider.refresh()
  })


  //get the token
  try {
    // Request GitHub authentication
    const session = await vscode.authentication.getSession('github', ['repo', 'user'], { createIfNone: true });
    token = session.accessToken;
  } catch (error) {
    console.error('Error getting GitHub token:', error);
  }


  const owner = "your-github-username";
  const repo = "your-repo-name";
  const prNumber = 1; // Replace with your PR number

  // Fetch PR comments
  //const comments = await fetchPRComments(owner, repo, prNumber);

  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found!");
    return;
  }

  const comments = [
    {
      body: "what is this code. how can someone code something so trash and so un-usable. which school did you go to so I'll know to never hire again from your school. you should just stop doing computer science. this major ain't for you. go study communications or something since it'll be easy enough for you and stay broke.",
      path: "random.ts",
      lineStart: 1,
      lineEnd: 3,
    },
    {
      body: "this is bad",
      path: "random.ts",
      lineStart: 8,
      lineEnd: 12,
    },
  ];

  // Display comments inline
  displayInlineComments(editor, comments);
}

export const authToken = token;

export async function sendAuthTokenToBackend() {
  const token = authToken; // The token you got from GitHub authentication
  
  if (!token) {
    vscode.window.showErrorMessage("No auth token available.");
    return;
  }

  const backendUrl = 'http://localhost:3000/api/get-token';

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token, // Send the token to your backend
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send request: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Backend response:', responseData);
  } catch (error) {
    console.error('Error sending token to backend:', error);
    vscode.window.showErrorMessage('Failed to send auth token to backend');
  }
}
