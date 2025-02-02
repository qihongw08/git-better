import * as vscode from "vscode";
import axios from "axios";
import { getRepoInfo } from "./extension";

export class CreatePullRequestPanel {
  public static currentPanel: CreatePullRequestPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (CreatePullRequestPanel.currentPanel) {
      CreatePullRequestPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "createPullRequest",
      "Create Pull Request",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      }
    );

    CreatePullRequestPanel.currentPanel = new CreatePullRequestPanel(
      panel,
      extensionUri
    );
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Listen for messages from the webview
    this._panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "createPR") {
        const { title, description, sourceBranch, targetBranch } = message;
        // Call the function to create PR
        this.createPullRequest(title, description, sourceBranch, targetBranch);
      }
    });
  }

  private async _update() {
    const webview = this._panel.webview;
    const currentBranch = await this.getCurrentBranch();

    this._panel.webview.html = this._getHtmlForWebview(webview, currentBranch);
  }

  private async getCurrentBranch(): Promise<string> {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      vscode.window.showErrorMessage("Git extension not found.");
      return "main"; // Default if no Git extension
    }

    const git = gitExtension.exports.getAPI(1);
    const repo = git.repositories[0]; // Assuming single repository
    const branch = repo.state.HEAD.name; // Active branch

    return branch;
  }

  private _getHtmlForWebview(webview: vscode.Webview, currentBranch: string) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Pull Request</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          input, textarea, select { width: 100%; margin-bottom: 10px; padding: 5px; }
          button { padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Create Pull Request</h1>
        <input type="text" id="prTitle" placeholder="Pull Request Title" required>
        <textarea id="prDescription" placeholder="Pull Request Description (optional)" rows="4"></textarea>
        <select id="sourceBranch">
          <option value="${currentBranch}">${currentBranch}</option>
        </select>
        <select id="targetBranch">
          <option value="main">main</option>
          <option value="develop">develop</option>
        </select>
        <button id="createPR">Create Pull Request</button>

        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById('createPR').addEventListener('click', () => {
            const title = document.getElementById('prTitle').value;
            const description = document.getElementById('prDescription').value;
            const sourceBranch = document.getElementById('sourceBranch').value;
            const targetBranch = document.getElementById('targetBranch').value;
            vscode.postMessage({
              command: 'createPR',
              title,
              description,
              sourceBranch,
              targetBranch
            });
          });
        </script>
      </body>
      </html>
    `;
  }

  private async createPullRequest(
    title: string,
    description: string,
    sourceBranch: string,
    targetBranch: string
  ) {
    // Ensure token is available (fetch from global context or authentication)
    let token: string | undefined;
    try {
      const session = await vscode.authentication.getSession(
        "github",
        ["repo", "user"],
        { createIfNone: true }
      );
      token = session.accessToken;
    } catch (error) {
      vscode.window.showErrorMessage("Error getting GitHub token.");
      return;
    }

    const repoInfo = await getRepoInfo();

    if (!repoInfo) {
      vscode.window.showErrorMessage("Failed to fetch repository information.");
      return;
    }

    const { owner, repoName } = repoInfo;

    if (!token) {
      vscode.window.showErrorMessage("GitHub token is missing.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repoName}/pulls`,
        {
          title,
          body: description,
          head: sourceBranch, // Source branch
          base: targetBranch, // Target branch (e.g., main)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const prUrl = response.data.html_url;
      vscode.window.showInformationMessage(
        `Pull Request created successfully! View it here: ${prUrl}`
      );
    } catch (error) {
      console.error("Error creating pull request:", error);
      vscode.window.showErrorMessage(
        "Failed to create pull request. Please try again."
      );
    }
  }

  public dispose() {
    CreatePullRequestPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
