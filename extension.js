const vscode = require('vscode');
const fetch = require('node-fetch');

const API_URL = 'https://api.hydrovolter.workers.dev/vscode/';
let startTime = Date.now();
let isSyncing = true; // Default: Syncing is ON
let statusBarItem;

/**
 * Retrieves workspace and editor information
 */
function updateWorkspaceInfo() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;

    const document = editor.document;
    const position = editor.selection.active;

    return {
        workspace: vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].name : "Unknown",
        fileName: document.fileName.split(/[/\\]/).pop(),
        language: document.languageId,
        line: position.line + 1,
        column: position.character + 1,
        startTime: startTime,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000)
    };
}

/**
 * Sends workspace data to API if syncing is enabled
 */
async function sendData() {
    if (!isSyncing) return;
    
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

/**
 * Toggles syncing on/off and updates the status bar item
 */
function toggleSyncing() {
    isSyncing = !isSyncing;
    updateStatusBar();
}

/**
 * Updates the status bar text
 */
function updateStatusBar() {
    if (statusBarItem) {
        statusBarItem.text = isSyncing ? '$(sync) Syncing' : '$(circle-slash) Not Syncing';
        statusBarItem.tooltip = isSyncing ? 'Click to stop syncing' : 'Click to start syncing';
    }
}

function activate(context) {
    console.log('VS Code Presence API activated');

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'extension.toggleSyncing';
    updateStatusBar();
    statusBarItem.show();
    
    let toggleCommand = vscode.commands.registerCommand('extension.toggleSyncing', toggleSyncing);
    
    // Start sending data at 5s intervals
    const interval = setInterval(sendData, 5000);

    context.subscriptions.push(statusBarItem, toggleCommand, new vscode.Disposable(() => clearInterval(interval)));
}

function deactivate() {
    console.log('VS Code Presence API deactivated');
}

module.exports = { activate, deactivate };
