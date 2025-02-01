import * as vscode from 'vscode';
//import { GitBetterProvider } from './GitBetterProvider';
import { ButtonViewProvider } from './ButtonViewProvider';
import { startServer } from './server/index';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-better" is now active!');

	// // Register GitBetter Tree View
	// const gitBetterProvider = new GitBetterProvider();
	// vscode.window.registerTreeDataProvider('gitBetter', gitBetterProvider);

	// Register New Button View
	const buttonViewProvider = new ButtonViewProvider();
	vscode.window.registerTreeDataProvider('buttonView', buttonViewProvider);

	// // Refresh Commands
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('git-better.refresh', () => gitBetterProvider.refresh())
	// );

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
}

export function deactivate() {}
