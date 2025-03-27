# VS Code Presence Extension

This Visual Studio Code extension fetches workspace information and sends it to a public API. It is designed to integrate with external services by providing real-time updates about your current workspace (for example, [my portfolio](https://hydrovolter.com))

## Features

- Fetches workspace details such as:
    - Current file name
    - Workspace folder name
    - Active programming language
- Sends the collected data to a configurable public API endpoint.
- Lightweight and easy to configure.

## Installation

1. Clone this repository:
     ```bash
     git clone https://github.com/your-username/ext-vscode-presence.git
     ```
2. Open the folder in Visual Studio Code.
3. Run the extension in the Extension Development Host:
     - Press `F5` or go to `Run > Start Debugging`.

## Usage

1. Configure the API endpoint in the extension settings:
     - Go to `File > Preferences > Settings` (or `Code > Preferences > Settings` on macOS).
     - Search for `Presence API Endpoint` and set the URL of your public API.

2. Open a workspace in VS Code. The extension will automatically fetch workspace information and send it to the configured API.

## Configuration

The extension provides the following settings:

- **Presence API Endpoint**: The URL of the public API where workspace information will be sent.

## Development

To contribute or modify the extension:

1. Install dependencies:
     ```bash
     npm install
     ```
2. Make your changes and test them in the Extension Development Host.

## License

This project is licensed under the [MIT License](LICENSE).