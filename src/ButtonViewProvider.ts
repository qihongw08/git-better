import * as vscode from 'vscode';

export class ButtonViewProvider implements vscode.TreeDataProvider<ButtonItem> {
  
  private _onDidChangeTreeData: vscode.EventEmitter<ButtonItem | undefined | void> = new vscode.EventEmitter<ButtonItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ButtonItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ButtonItem): vscode.TreeItem {
    return element;
  }

  getChildren(): ButtonItem[] {
    return [
      new ButtonItem("Button 1", "git-better.button1"),
      new ButtonItem("Button 2", "git-better.button2")
    ];
  }
}

class ButtonItem extends vscode.TreeItem {
  constructor(label: string, command: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: command,
      title: label,
      arguments: [label]
    };
    this.iconPath = new vscode.ThemeIcon("play"); // Customize icon if needed
  }
}
