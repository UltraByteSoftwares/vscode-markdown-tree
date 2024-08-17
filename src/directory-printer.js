const FastGlobExplorer = require('./fastglob-explorer.js');
const FlatTreePrinter = require('./flat-tree-printer.js');
const TreeDecorator = require('./tree-decorator.js');
const path = require('path');

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

        // Set the default options
        this._options = {
            offset: 4
        }
    }

    /**
     * 
     * @param {string} folderpath 
     * @param {Object} [options=null] 
     * @returns {string}
     */
    async print(folderpath, options = null) {
        // Copy the default options
        let opts = {...this._options};

        if (options)
            Object.assign(opts, options);

        // Get the files in a flat list
        const files = await this._explorer.getFiles(folderpath);

        // Create indented list from the above flat list
        const indented = this._printer.print(files, {offset: opts.indentation});

        /* Since, the decorator below needs an indented tree with only one 
        root and the output we got above doesn't have the root folder, we need to add
        the root element ourselves and then send it to the decorator */
        const baseName = path.basename(folderpath);

        // Decorate them with branch lines
        const list = this._decorator.decorate([baseName, ...indented]);

        // Return the output
        return list.join('\n');
    }
}

module.exports = DirectoryPrinter;
