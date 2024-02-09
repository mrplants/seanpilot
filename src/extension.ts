// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios'; // Make sure to install axios in your extension project

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension is now active!');

    const provider = vscode.languages.registerInlineCompletionItemProvider(
        { pattern: '**' }, // This pattern applies to all files, adjust as necessary
        {
            async provideInlineCompletionItems(
                document: vscode.TextDocument,
                position: vscode.Position,
                context: vscode.InlineCompletionContext,
                token: vscode.CancellationToken
            ): Promise<vscode.InlineCompletionList> { // Changed to async function
                const codeBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
                
                try {
                    // Make the HTTP request to your Flask server
                    const response = await axios.post('http://localhost:5000/completion', {
                        code_context: codeBeforeCursor
                    });

                    // Use the completion returned by your server
                    const completionText = response.data.completion;
                    console.log('new completion: ', completionText);
                    const inlineCompletionItem = new vscode.InlineCompletionItem(
                        completionText,
                        new vscode.Range(position, position)
                    );

                    return {
                        items: [inlineCompletionItem],
                    };
                } catch (error) {
                    console.error('Error fetching completion:', error);
                    return { items: [] };
                }
            }
        }
    );

    context.subscriptions.push(provider);
}

export function deactivate() {}
