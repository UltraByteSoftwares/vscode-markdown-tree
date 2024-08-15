const vscode = require('vscode');
const DirectoryPrinter = require('./directory-printer.js');

/**
 * Will create the tree and print at the active editor cursor
 * @param {string} folderpath 
 * @returns {void}
 */
async function printFolderTree(folderpath) {
    try {
        const dirPrinter = new DirectoryPrinter();
		
        // print the tree at the cursor
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.isEmpty) {
			const position = editor.selection.active;
            const offset = position.character;
			const output = await dirPrinter.print(folderpath, {offset: offset});
			
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
    // This command will come from r-click on explorer
    const generateFolderTreeFromSelection = 'ultree.generateFolderTreeFromSelection';
    context.subscriptions.push(vscode.commands.registerCommand(generateFolderTreeFromSelection, async (uri) => {
        printFolderTree(uri.fsPath)
    }));

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
