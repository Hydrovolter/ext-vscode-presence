const vscode = require('vscode');
const fetch = require('node-fetch');

let startTime;
let isSyncing = true;
let statusBarItem;
let interval;

/**
 * Retrieves the user settings from VS Code
 */
function getSettings() {
    const config = vscode.workspace.getConfiguration('vscode-presence');
    return {
        apiUrl: config.get('apiUrl', 'https://api.hydrovolter.workers.dev/vscode/'),
        syncInterval: config.get('syncInterval', 5000) // Default: 5s
    };
}

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

    const { apiUrl } = getSettings();
    const data = updateWorkspaceInfo();
    if (!data) return;

    try {
        await fetch(apiUrl, {
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
 * Restarts syncing with updated settings
 */
function restartSyncing() {
    startTime = Date.now();
    const { syncInterval } = getSettings();
    
    if (interval) clearInterval(interval); // Clear any existing interval
    interval = setInterval(sendData, syncInterval);
    
    sendData(); // Send an immediate request when reactivated
}

/**
 * Handles settings changes dynamically
 */
function handleConfigurationChange(event) {
    if (event.affectsConfiguration('vscode-presence.apiUrl') || event.affectsConfiguration('vscode-presence.syncInterval')) {
        restartSyncing();
    }
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

    // Listen for settings changes
    vscode.workspace.onDidChangeConfiguration(handleConfigurationChange);

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
