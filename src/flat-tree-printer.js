/**
 * Class meant to turn a sorted "flat" file/folder list to
 * an "indented" folder list
 */
class FlatTreePrinter {
    constructor() {
        this._options = {
            separator: '/',
            indentation: 4,
            offset: 0
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
     * 
     * @param {string[]} items Array of strings must be sorted
     * @param {{separator?: string, indentation?: number, offset?: number}} options
     * @param {CallableFunction} formatter 
     * @returns {string[]} 
     */
    print(items, options = null, formatter = null) {
        // Copy the default options
        let opts = {...this._options};

        if (options)
            Object.assign(opts, options);
        
        let format = (item) => item;
        if (formatter)
            format = formatter;
        
        const lines = [];
        for (let item of items) {
            // Split at separator, say '/' for files
            const list = item.split(opts.separator).filter(e => e.trim() !== '')

            // e.g. for say src/file.js, there should be only one unit indent
            const totalIndent = (list.length - 1) * opts.indentation + opts.offset;

            lines.push(`${' '.repeat(totalIndent)}${format(list[list.length - 1])}`);
        }

        return lines;
    }
}

module.exports = FlatTreePrinter;
