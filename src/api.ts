import axios from "axios";
import * as vscode from "vscode";

export async function getCurrentBranchAndRemote() {
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (!gitExtension) {
    vscode.window.showErrorMessage("Git extension not found.");
    return null;
  }

  const git = gitExtension.exports.getAPI(1);
  const repo = git.repositories[0]; // Assuming single repository
  const branch = repo.state.HEAD.name; // Active branch
  const remote = repo.state.remotes.find(
    (r: { name: string }) => r.name === "origin"
  ); // Get remote "origin"

  if (!remote) {
    vscode.window.showErrorMessage("No remote repository found.");
    return null;
  }

  return { branch, remoteUrl: remote.fetchUrl };
}

getCurrentBranchAndRemote().then((result) => {
  if (result) {
    console.log("Current branch:", result.branch);
    console.log("Remote URL:", result.remoteUrl);
  }
});
