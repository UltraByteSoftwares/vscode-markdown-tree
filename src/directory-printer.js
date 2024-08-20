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
     * The options returned by this function are the options that 
     * users of this object can control
     */
    getDefaultOptions() {
        return {
            ignore: "",
            indentation: 4,
            branchLines: '├─',
            recursive: true,
            maxDepth: -1,
            trailingSlash: false
        }
    }

    /**
     * @async
     * @param {string} folderpath 
     * @param {*} [options=null] 
     * @returns {string[]}
     */
    async print(folderpath, options = null) {
        const {recursive, ignore, maxDepth, trailingSlash, indentation, branchLines} =
            OptionsManager.copyOptions(this.getDefaultOptions(), options);

        // Get the files in a flat list
        const files = await this._explorer.getFiles(folderpath, {
            recursive: recursive,
            ignore: ignore,
            deep: maxDepth,
            markDirectories: trailingSlash
        });

        // Create indented list from the above flat list
        const indented = this._printer.print(files, {
            indentation: indentation < 2 ? 2 : indentation
        });

        // Decorate them with branch lines
        // But, first this one requires some preprocessing of options
        const dopts = this._decorator.getDefaultOptions();
        if (branchLines === 'None') {
            Object.assign(dopts, {
                endmark: '',
                midmark: '',
                hline: '',
                vline: ''
            });
        }

        const list = this._decorator.decorate(indented, dopts);

        // Return the output
        return list;
    }
}

module.exports = DirectoryPrinter;
