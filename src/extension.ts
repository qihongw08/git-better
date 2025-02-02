import * as vscode from "vscode";
import { displayInlineComments } from "./views/commentPanel";
//import { startServer } from "./server";
import { CreatePullRequestPanel } from "./CreatePullRequest";
import { EditPullRequestPanel } from "./EditPullRequest";
import { PullRequestProvider } from "./PullRequestProvider";

let token = "";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "pull-request-manager" is now active!'
  );

  //get the token
  try {
    // Request GitHub authentication
    const session = await vscode.authentication.getSession(
      "github",
      ["repo", "user"],
      { createIfNone: true }
    );
    token = session.accessToken;
  } catch (error) {
    console.error("Error getting GitHub token:", error);
  }

  const pullRequestProvider = new PullRequestProvider(context);
  vscode.window.registerTreeDataProvider(
    "pullRequestList",
    pullRequestProvider
  );

  const createPRDisposable = vscode.commands.registerCommand(
    "pull-request-manager.createPR",
    () => {
      CreatePullRequestPanel.createOrShow(context.extensionUri);
    }
  );

  const editPRDisposable = vscode.commands.registerCommand(
    "pull-request-manager.editPR",
    (prId: string) => {
      EditPullRequestPanel.createOrShow(context.extensionUri, prId);
    }
  );

  const refreshPRDisposable = vscode.commands.registerCommand(
    "pull-request-manager.refreshPRs",
    () => {
      pullRequestProvider.refresh();
    }
  );

  const searchPRDisposable = vscode.commands.registerCommand(
    "pull-request-manager.searchPRs",
    async () => {
      const query = await vscode.window.showInputBox({
        placeHolder: "Search pull requests...",
        prompt: "Enter a search query for pull requests",
      });
      if (query !== undefined) {
        pullRequestProvider.setSearchQuery(query);
      }
    }
  );

  const comments = await fetchPRComments();

  const displayCommentsCommand = vscode.commands.registerCommand(
    "pull-request-manager.displayComments",
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor found!");
        return;
      }

      if (comments) {
        displayInlineComments(editor, comments);
      }
    }
  );

  context.subscriptions.push(
    createPRDisposable,
    editPRDisposable,
    refreshPRDisposable,
    searchPRDisposable,
    displayCommentsCommand
  );

  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found!");
    return;
  }
}

async function getRepoInfo() {
  console.log("Getting repository information...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (!gitExtension) {
    vscode.window.showErrorMessage("Git extension not found.");
    return null;
  }

  const git = gitExtension.exports.getAPI(1);
  const repo = git.repositories[0]; // Assuming a single repository is open
  if (!repo) {
    vscode.window.showErrorMessage("No repository found.");
    return null;
  }

  // Get remote URL (e.g., "https://github.com/owner/repo.git")
  const remote = repo.state.remotes.find(
    (r: { name: string }) => r.name === "origin"
  );
  if (!remote) {
    vscode.window.showErrorMessage("No remote repository found.");
    return null;
  }

  const remoteUrl = remote.fetchUrl;
  if (!remoteUrl) {
    vscode.window.showErrorMessage("Remote URL not found.");
    return null;
  }

  // Extract owner and repo from URL
  const match = remoteUrl.match(/github\.com[/:](.+?)\/(.+?)(\.git)?$/);
  if (!match) {
    vscode.window.showErrorMessage("Failed to parse repository URL.");
    return null;
  }

  const owner: string = match[1];
  const repoName: string = match[2];

  return { owner, repoName };
}

async function fetchPRComments() {
  const repoInfo = await getRepoInfo();
  if (!repoInfo) {
    return;
  }
  const { owner, repoName } = repoInfo;
  const url = `https://api.github.com/repos/${owner}/${repoName}/pulls/comments`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: any = await response.json();

  const comments = data.map((comment: any) => ({
    body: comment.body,
    path: comment.path,
    lineStart: comment.start_line ? comment.start_line : comment.line,
    lineEnd: comment.line,
  }));

  return comments;
}
