import * as vscode from 'vscode';

export class PRFormWebviewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView): void {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the Webview
        webviewView.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'createPR':
                    vscode.window.showInformationMessage(`Created PR: ${message.title}`);
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Create Pull Request</title>
            </head>
            <body>
                <h1>Create Pull Request</h1>
                <form>
                    <label for="title">Title:</label><br>
                    <input type="text" id="title" name="title"><br><br>
                    <label for="description">Description (optional):</label><br>
                    <textarea id="description" name="description"></textarea><br><br>
                    <label for="baseBranch">Base Branch:</label><br>
                    <input type="text" id="baseBranch" name="baseBranch"><br><br>
                    <label for="compareBranch">Compare Branch:</label><br>
                    <input type="text" id="compareBranch" name="compareBranch"><br><br>
                    <button type="button" onclick="createPR()">Create</button>
                </form>
                <script>
                    const vscode = acquireVsCodeApi();

                    function createPR() {
                        const title = document.getElementById('title').value;
                        const description = document.getElementById('description').value;
                        const baseBranch = document.getElementById('baseBranch').value;
                        const compareBranch = document.getElementById('compareBranch').value;

                        vscode.postMessage({
                            command: 'createPR',
                            title,
                            description,
                            baseBranch,
                            compareBranch,
                        });
                    }
                </script>
            </body>
            </html>
        `;
    }
}