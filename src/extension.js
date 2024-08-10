// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

function activate() {
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
