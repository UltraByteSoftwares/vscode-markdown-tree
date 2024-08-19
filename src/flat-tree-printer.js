/**
 * Class meant to turn a sorted "flat" file/folder list to
 * an "indented" folder list
 */
class FlatTreePrinter {
    constructor() {
        this._options = {
            separator: '/',
            indentation: 4
        }
    }

    /**
     * 
     * @param {string} str 
     * @param {string} [separator='/'] 
     */
    _getDepth(str, separator = '/') {
        return str.split(separator).filter(e => e.trim() !== '').length;
    }

    /**
     * An indented files/folder list is generated from the supplied flat files list.
     * The original files array is mutated and also returned
     * @param {string[]} files Array of strings must be sorted
     * @param {{separator?: string, indentation?: number}} options
     * @param {CallableFunction} formatter 
     * @returns {string[]} 
     */
    print(files, options = null, formatter = null) {
        // Copy the default options
        let opts = {...this._options};

        if (options)
            Object.assign(opts, options);
        
        let format = (item) => item;
        if (formatter)
            format = formatter;
        
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];

            // Split at separator, say '/' for files
            const list = file.split(opts.separator).filter(e => e.trim() !== '')

            // e.g. for say src/file.js, there should be only one unit indent
            const totalIndent = (list.length - 1) * opts.indentation;

            files[i] = `${' '.repeat(totalIndent)}${format(list[list.length - 1])}`;
        }

        return files;
    }
}

module.exports = FlatTreePrinter;
