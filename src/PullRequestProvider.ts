import * as vscode from 'vscode';

export class PullRequestProvider implements vscode.TreeDataProvider<PullRequest> {
  private _onDidChangeTreeData: vscode.EventEmitter<PullRequest | undefined | null | void> = new vscode.EventEmitter<PullRequest | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PullRequest | undefined | null | void> = this._onDidChangeTreeData.event;

  // Mock data for pull requests
  private pullRequests: PullRequest[] = [
    new PullRequest('1', 'Add new feature', vscode.TreeItemCollapsibleState.None),
    new PullRequest('2', 'Fix critical bug', vscode.TreeItemCollapsibleState.None),
    new PullRequest('3', 'Update documentation', vscode.TreeItemCollapsibleState.None),
  ];

  getTreeItem(element: PullRequest): vscode.TreeItem {
    return element;
  }

  getChildren(element?: PullRequest): Promise<PullRequest[]> { //Fixed: Changed Thenable to Promise
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve(this.pullRequests);
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class PullRequest extends vscode.TreeItem {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = this.id;
    this.command = {
      command: 'pull-request-manager.editPR',
      title: 'Edit Pull Request',
      arguments: [this.id]
    };
  }
}