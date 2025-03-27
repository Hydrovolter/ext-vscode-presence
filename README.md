# VS Code Presence Extension

A Visual Studio Code extension that fetches workspace information and sends it to a public API. Designed to integrate with external services by providing real-time updates about your current workspace (for example, [my portfolio](https://hydrovolter.com))

## Features

- Fetches workspace details such as:
    - Current file name
    - Workspace folder name
    - Active programming language
- Sends the collected data to a configurable public API endpoint.
- Lightweight and easy to configure.

## Development

1. Clone this repository:
     ```bash
     git clone https://github.com/hydrovolter/ext-vscode-presence.git
     ```
2. Install dependencies:
     ```bash
     npm install
     ```
3. Open the folder in Visual Studio Code.
4. Run the extension in the Extension Development Host:
     - Press `F5` or go to `Run > Start Debugging`.

## Installation

1. Clone this repository:
     ```bash
     git clone https://github.com/hydrovolter/ext-vscode-presence.git
     ```
2. Install dependencies:
     ```bash
     npm install
     ```
3. Open the folder in Visual Studio Code.
4. Compile the extension:
    ```bash
        vsce package
    ```

## Usage

1. Configure the API endpoint in the extension settings:
     - Go to `File > Preferences > Settings` (or `Code > Preferences > Settings` on macOS).
     - Search for `API URL` and set the URL of your public API.

2. Open a workspace in VS Code. The extension will automatically fetch workspace information and send it to the configured API.

## Configuration

The extension provides the following settings:

- **API URL**: The API URL to send workspace data.
- **Sync Interval**: Interval in milliseconds between API syncs (minimum 1000ms)

## Development

To contribute or modify the extension:

1. Install dependencies:
     ```bash
     npm install
     ```
2. Make your changes and test them in the Extension Development Host.

## License

This project is licensed under the [MIT License](LICENSE).

Made by Hydrovolter