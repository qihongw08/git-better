import * as vscode from "vscode";

export class CreatePullRequestPanel {
  public static currentPanel: CreatePullRequestPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

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
      },
    );

    CreatePullRequestPanel.currentPanel = new CreatePullRequestPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  private _update() {
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
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
          <option value="feature-branch">feature-branch</option>
          <option value="bugfix-branch">bugfix-branch</option>
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

