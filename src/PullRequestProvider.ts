import * as vscode from "vscode"

export class PullRequestProvider implements vscode.TreeDataProvider<PullRequest | SectionTitle> {
  private _onDidChangeTreeData: vscode.EventEmitter<PullRequest | SectionTitle | undefined | null | void> =
    new vscode.EventEmitter<PullRequest | SectionTitle | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<PullRequest | SectionTitle | undefined | null | void> =
    this._onDidChangeTreeData.event

  private searchQuery = ""

  // Mock data for pull requests
  private pullRequests: PullRequest[] = [
    new PullRequest("107", "PR #107: Add new feature", vscode.TreeItemCollapsibleState.None),
    new PullRequest("63", "PR #63: Fix critical bug", vscode.TreeItemCollapsibleState.None),
    new PullRequest("15", "PR #15: Update documentation", vscode.TreeItemCollapsibleState.None),
  ]

  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: PullRequest | SectionTitle): vscode.TreeItem {
    return element
  }

  getChildren(element?: PullRequest | SectionTitle): Promise<(PullRequest | SectionTitle)[]> {
    // Updated return type
    if (element) {
      return Promise.resolve([])
    } else {
      const sectionTitle = new SectionTitle("Edit: Select from recent or search")
      const filteredPullRequests = this.pullRequests.filter((pr) =>
        pr.label.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
      return Promise.resolve([sectionTitle, ...filteredPullRequests])
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query
    this.refresh()
  }
}

class PullRequest extends vscode.TreeItem {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState)
    this.tooltip = `${this.label}`
    this.description = this.id
    this.command = {
      command: "pull-request-manager.editPR",
      title: "Edit Pull Request",
      arguments: [this.id],
    }
  }
}

class SectionTitle extends vscode.TreeItem {
    constructor(public readonly label: string) {
      super(label, vscode.TreeItemCollapsibleState.None)
  
      // Add styling tricks to make it more distinct
      this.tooltip = label
      this.contextValue = "sectionTitle"
  
      // Optional: Use an icon to differentiate it
      this.iconPath = new vscode.ThemeIcon("symbol-event") // Try different icons like "star", "flame", etc.
    }
  }
  

