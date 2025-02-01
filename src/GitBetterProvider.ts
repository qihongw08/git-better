import * as vscode from 'vscode';

export class GitBetterProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      // Return top-level items
      return Promise.resolve([
        new vscode.TreeItem('Title: [Input Box]'),
        new vscode.TreeItem('Description: [Input Box]'),
        new vscode.TreeItem('Compare Branches: [Side-by-Side Views]'),
        new vscode.TreeItem('Reviewers: [Dropdown]'),
        new vscode.TreeItem('Create Pull Request', vscode.TreeItemCollapsibleState.None)
      ]);
    }

    return Promise.resolve([]);
  }
}