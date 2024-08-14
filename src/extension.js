const vscode = require('vscode');

/**
 * Will create the tree and print at the active editor cursor
 * @param {Object} path 
 * @returns {void}
 */
function generateFolderTreeHandler(uri) {
	
	// print the tree at the cursor
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection.isEmpty) {
		const position = editor.selection.active;
		editor.edit(edit => {
			edit.replace(position, uri.path);
		});
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * 
 * @param {vscode.ExtensionContext} context 
 * @returns 
 */
function activate(context) {
	const generateFolderTree = 'ultree.generateFolderTree';

	context.subscriptions.push(vscode.commands.registerCommand(generateFolderTree, generateFolderTreeHandler));

	return {
		extendMarkdownIt(md) {
		  	return md.use(require('markdown-it-ultree'));
		}
	};
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
