import * as vscode from "vscode";
import { Comment } from "../types/comment";

export const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255, 215, 0, 0.3)", // Light yellow background
  isWholeLine: true,
  rangeBehavior: 1,
});

export function displayInlineComments(
  editor: vscode.TextEditor,
  comments: Comment[]
) {
  const decorations = comments.map((comment) => {
    const line = comment.lineStart - 1; // Convert to 0 index
    const range = new vscode.Range(line, 0, comment.lineEnd - 1, 0);

    const truncatedText =
      comment.body.length > 50
        ? comment.body.substring(0, 50) + "..."
        : comment.body;

    return {
      range,
      renderOptions: {
        after: {
          contentText: `💬 ${truncatedText}`, // Add an icon and truncated text
          color: "#888", // Light gray text
        },
      },
      hoverMessage: new vscode.MarkdownString(
        `**💬 Comment:**\n\n${comment.body}`
      ), // Full comment on hover
    };
  });

  editor.setDecorations(decorationType, decorations);
}
