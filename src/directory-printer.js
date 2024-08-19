const FastGlobExplorer = require('./fastglob-explorer.js');
const FlatTreePrinter = require('./flat-tree-printer.js');
const TreeDecorator = require('./tree-decorator.js');
const OptionsManager = require('./options-manager.js');

class DirectoryPrinter {
    static s_instance = null;

    /**
     * 
     * @returns {DirectoryPrinter}
     */
    static getInstance() {
        if (!DirectoryPrinter.s_instance)
            DirectoryPrinter.s_instance = new DirectoryPrinter();

        return DirectoryPrinter.s_instance;
    }

    constructor() {
        this._explorer = new FastGlobExplorer();
        this._printer = new FlatTreePrinter();
        this._decorator = new TreeDecorator();
        this._optionsMgr = new OptionsManager();
    }

    /**
     * @async
     * @param {string} folderpath 
     * @returns {string[]}
     */
    async print(folderpath) {
        // Get the files in a flat list
        const files = await this._explorer.getFiles(folderpath);

        // Create indented list from the above flat list
        const indented = this._printer.print(files);

        // Decorate them with branch lines
        const list = this._decorator.decorate(indented);

        // Return the output
        return list;
    }
}

module.exports = DirectoryPrinter;
