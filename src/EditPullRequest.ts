import * as vscode from "vscode"

export class EditPullRequestPanel {
  public static currentPanel: EditPullRequestPanel | undefined
  private readonly _panel: vscode.WebviewPanel
  private readonly _extensionUri: vscode.Uri
  private _disposables: vscode.Disposable[] = []

  public static createOrShow(extensionUri: vscode.Uri, prId: string) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined

    if (EditPullRequestPanel.currentPanel) {
      EditPullRequestPanel.currentPanel._panel.reveal(column)
      EditPullRequestPanel.currentPanel._update(prId)
      return
    }

    const panel = vscode.window.createWebviewPanel(
      "editPullRequest",
      "Edit Pull Request",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")],
      },
    )

    EditPullRequestPanel.currentPanel = new EditPullRequestPanel(panel, extensionUri, prId)
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, prId: string) {
    this._panel = panel
    this._extensionUri = extensionUri

    this._update(prId)

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)
  }

  private _update(prId: string) {
    const webview = this._panel.webview
    this._panel.webview.html = this._getHtmlForWebview(webview, prId)
  }

  private _getHtmlForWebview(webview: vscode.Webview, prId: string) {
    // Mock data for selected pull request
    const selectedPR = {
      id: prId,
      title: `Pull Request #${prId}`,
      description: "Added a new feature based on release 10.8. Integrated the new operating system with our goals.",
      author: "Qihong Wu",
      createdAt: "2025-02-01",
      history: [
        { type: "comment", author: "Vivian Zou", content: "Looks good to me!", createdAt: "2025-02-02" },
        { type: "commit", author: "Qihong Wu", content: "Update bug on line 14", createdAt: "2023-02-03" },
        { type: "comment", author: "Alan Nguyen", content: "Can you add more tests?", createdAt: "2023-02-04" },
      ],
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit Pull Request</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .pr-info { margin-top: 20px; }
          .history-item { margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Edit Pull Request</h1>
        <div class="pr-info">
          <h2>${selectedPR.title}</h2>
          <p><strong>Author:</strong> ${selectedPR.author}</p>
          <p><strong>Created:</strong> ${selectedPR.createdAt}</p>
          <p><strong>Description:</strong> ${selectedPR.description}</p>
          <h3>History</h3>
          ${selectedPR.history
            .map(
              (item) => `
            <div class="history-item">
              <p><strong>${item.type === "comment" ? "Comment" : "Commit"} by ${item.author} on ${item.createdAt}</strong></p>
              <p>${item.content}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </body>
      </html>
    `
  }

  public dispose() {
    EditPullRequestPanel.currentPanel = undefined

    this._panel.dispose()

    while (this._disposables.length) {
      const x = this._disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }
}

