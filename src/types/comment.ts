import * as vscode from "vscode";

export interface Comment {
  body: string;
  path: string;
  lineStart: number;
  lineEnd: number;
}
