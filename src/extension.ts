// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitBetterProvider } from './GitBetterProvider';
import { startServer } from './server/index';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "git-better" is now active!');
	const disposable = vscode.commands.registerCommand('git-better.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from git-better!');

	});
	context.subscriptions.push(disposable);

	const gitBetterProvider = new GitBetterProvider();
	vscode.window.registerTreeDataProvider('gitBetter', gitBetterProvider);

	

	try {
		startServer();
	  } catch (error) {
		console.error("Error starting the server:", error);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
