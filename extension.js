const vscode = require('vscode');
const fetch = require('node-fetch');

const API_URL = 'https://api.hydrovolter.workers.dev/vscode/';
let startTime;
let isSyncing = true;
let statusBarItem;
let interval;

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
        fileName: document.fileName.split(/[/\\]/).pop(), // Extracts only the filename
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

/**
 * Resets the start time and ensures the interval is running
 */
function restartSyncing() {
    startTime = Date.now();
    
    if (interval) clearInterval(interval); // Clear any existing interval
    interval = setInterval(sendData, 5000);
    
    sendData(); // Send an immediate request when reactivated
}

function activate(context) {
    console.log('VS Code Presence API activated');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'extension.toggleSyncing';
    updateStatusBar();
    statusBarItem.show();

    // Register command for toggling syncing
    let toggleCommand = vscode.commands.registerCommand('extension.toggleSyncing', toggleSyncing);

    // Restart syncing on activation
    restartSyncing();

    // Restart syncing on workspace folder change (e.g., refresh, reopen)
    vscode.workspace.onDidChangeWorkspaceFolders(restartSyncing);

    // Add to context subscriptions
    context.subscriptions.push(statusBarItem, toggleCommand, new vscode.Disposable(() => clearInterval(interval)));
}

function deactivate() {
    console.log('VS Code Presence API deactivated');
    if (interval) clearInterval(interval);
}

module.exports = { activate, deactivate };
