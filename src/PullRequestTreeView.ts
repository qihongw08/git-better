import * as vscode from 'vscode';

export class PullRequestTreeView implements vscode.TreeDataProvider<PullRequestItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PullRequestItem | undefined | null | void> = new vscode.EventEmitter<PullRequestItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PullRequestItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PullRequestItem): vscode.TreeItem {
        if (element.id === 'createPR') {
            const item = new vscode.TreeItem('Create Pull Request', vscode.TreeItemCollapsibleState.None);
            item.command = {
                command: 'pullRequestHelper.createPR',
                title: 'Create Pull Request',
            };
            return item;
        }
        return element;
    }
    
    getChildren(element?: PullRequestItem): Thenable<PullRequestItem[]> {
        if (element) {
            return Promise.resolve(element.getChildren());
        } else {
            // Add "Create PR" button to the top
            const createPRItem = new PullRequestItem('Create Pull Request', 'createPR');
            return Promise.resolve([createPRItem, ...this.getPullRequests()]);
        }
    }

    private getPullRequests(): PullRequestItem[] {
        // Fake data for now
        return [
            new PullRequestItem('PR #1: Fix bug in login', '1', [
                new PullRequestItem('Comment: This is great!', '1.1'),
                new PullRequestItem('Commit: Fixed login bug', '1.2'),
            ]),
            new PullRequestItem('PR #2: Add new feature', '2', [
                new PullRequestItem('Comment: Needs more tests', '2.1'),
                new PullRequestItem('Commit: Added feature', '2.2'),
            ]),
        ];
    }
}

export class PullRequestItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly children?: PullRequestItem[]
    ) {
        super(label, children ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.tooltip = this.label;
        this.description = this.id;
    }

    getChildren(): PullRequestItem[] {
        return this.children || [];
    }
}