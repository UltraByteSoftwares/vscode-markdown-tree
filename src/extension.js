const vscode = require('vscode');
const DirectoryPrinter = require('./folderTree.js');

/**
 * Will create the tree and print at the active editor cursor
 * @param {Object} path 
 * @returns {void}
 */
async function printFolderTree(uri) {
    try {
        const dirPrinter = new DirectoryPrinter();
		
        // print the tree at the cursor
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.isEmpty) {
			const position = editor.selection.active;
            const offset = position.character;
			const output = await dirPrinter.print(uri.fsPath, {exclude: /(^\.|node_modules)/, offset: offset});
			
            editor.edit(edit => {
                edit.replace(position, output);
            });
        }
    } catch (err) {
        console.error(err);
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

    context.subscriptions.push(vscode.commands.registerCommand(generateFolderTree, printFolderTree));

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
