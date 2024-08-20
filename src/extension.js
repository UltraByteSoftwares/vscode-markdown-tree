const vscode = require('vscode');
const DirectoryPrinter = require('./directory-printer.js');

/**
 * Will create the tree and print at the active editor cursor
 * @param {string} folderpath 
 * @returns {void}
 */
async function printFolderTree(folderpath) {
    try {
        const dirPrinter = DirectoryPrinter.getInstance();
		
        // print the tree at the cursor
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.selection.isEmpty) {
			const position = editor.selection.active;
            const offset = position.character;

            const config = vscode.workspace.getConfiguration('markdown-ultree');
			const output = await dirPrinter.print(folderpath, {
                ignore : config.get("folders.ignore"),
                indentation : config.get("folders.indentation"),
                branchLines : config.get("folders.branchlines"),
                recursive : config.get("folders.recursive"),
                maxDepth : config.get("folders.maximumDepth"),
                trailingSlash : config.get("folders.trailingSlash"),
                dot: config.get("folders.dot")
            });
			
            editor.edit(edit => {
                edit.replace(position, output.join(`\n${' '.repeat(offset)}`));
            });
        }
    } catch (err) {
        // If it is an Error with 'Error:' in message, show the error
        if (err.message.search('Error:') !== -1) {
            await vscode.window.showErrorMessage(err.message);
        }

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
        await printFolderTree(uri.fsPath);
    }));

    // Command from command palette
    const generateFolderTree = 'ultree.generateFolderTree';
    context.subscriptions.push(vscode.commands.registerCommand(generateFolderTree, async () => {
        // ask for user input
        const folderpath = await vscode.window.showInputBox();

        // send the user input
        printFolderTree(folderpath)
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
