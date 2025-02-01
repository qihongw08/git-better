import * as vscode from "vscode";
import { displayInlineComments } from "./views/commentPanel";
import { startServer } from "./server";
import { ButtonViewProvider } from "./ButtonViewProvider";

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.showCommentBox",
    () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor found!");
        return;
      }
    }
  );

	// Register New Button View
	const buttonViewProvider = new ButtonViewProvider();
	vscode.window.registerTreeDataProvider('buttonView', buttonViewProvider);

	context.subscriptions.push(
		vscode.commands.registerCommand('buttonView.refresh', () => buttonViewProvider.refresh())
	);
  
	// Button Commands
	context.subscriptions.push(
		vscode.commands.registerCommand('git-better.button1', () => {
			vscode.window.showInformationMessage('Button 1 Clicked!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('git-better.button2', () => {
			vscode.window.showInformationMessage('Button 2 Clicked!');
		})
	);

	// Start Server
	try {
		startServer();
	} catch (error) {
		console.error("Error starting the server:", error);
	}

  const owner = "your-github-username";
  const repo = "your-repo-name";
  const prNumber = 1; // Replace with your PR number

  // Fetch PR comments
  //const comments = await fetchPRComments(owner, repo, prNumber);

  // Get the active text editor
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active text editor found!");
    return;
  }

  const comments = [
    {
      body: "what is this code. how can someone code something so trash and so un-usable. which school did you go to so I'll know to never hire again from your school. you should just stop doing computer science. this major ain't for you. go study communications or something since it'll be easy enough for you and stay broke.",
      path: "random.ts",
      lineStart: 1,
      lineEnd: 3,
    },
    {
      body: "this is bad",
      path: "random.ts",
      lineStart: 8,
      lineEnd: 12,
    },
  ];

  // Display comments inline
  displayInlineComments(editor, comments);
}
