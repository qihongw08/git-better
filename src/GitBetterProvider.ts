import * as vscode from 'vscode';

export class GitBetterProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  refresh(): void {
    
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!element) {
      // Return top-level items
      return Promise.resolve([
        new vscode.TreeItem('Item 1', vscode.TreeItemCollapsibleState.Collapsed),
        new vscode.TreeItem('Reviewers', vscode.TreeItemCollapsibleState.Collapsed)
      ]);
    }

    if (element.label === 'Reviewers') {
      return Promise.resolve([
        new vscode.TreeItem('Reviewer 1', vscode.TreeItemCollapsibleState.None),
        new vscode.TreeItem('Reviewer 1', vscode.TreeItemCollapsibleState.None),
      ]);
    }

    return Promise.resolve([]);
  }
}