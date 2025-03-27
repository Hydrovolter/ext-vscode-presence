const vscode = require('vscode');
const fetch = require('node-fetch');

const API_URL = 'https://api.hydrovolter.workers.dev/vscode/'; // Replace with your Cloudflare Worker URL
let startTime = Date.now();

function updateWorkspaceInfo() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const position = editor.selection.active;

    return {
        workspace: vscode.workspace.name || 'Unknown',
        fileName: document.fileName.split('/').pop(),
        language: document.languageId,
        line: position.line + 1,
        column: position.character + 1,
        startTime: startTime,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
    };
}

async function sendData() {
    const data = updateWorkspaceInfo();
    if (!data) return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

function activate(context) {
    const interval = setInterval(sendData, 5000); // Send data every 5 seconds
    context.subscriptions.push(new vscode.Disposable(() => clearInterval(interval)));
    console.log('VS Code Presence API activated');
}

function deactivate() {
    console.log('VS Code Presence API deactivated');
}

module.exports = { activate, deactivate };
