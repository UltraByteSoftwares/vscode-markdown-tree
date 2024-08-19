const OptionsManager = require('./options-manager.js');

/**
 * Class meant to turn a sorted "flat" file/folder list to
 * an "indented" folder list
 */
class FlatTreePrinter {
    getDefaultOptions() {
        return {
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
        const {separator, indentation} =
            OptionsManager.copyOptions(this.getDefaultOptions(), options);

        let format = (item) => item;
        if (formatter)
            format = formatter;
        
        for (let i = 0; i < files.length; ++i) {
            // Split at separator, say '/' for files
            const list = files[i].split(separator);

            let slash = '';
            let len = list.length;

            if (list[list.length - 1].trim() === '') {
                slash = '/'
                len = list.length - 1;
            }

            // e.g. for say src/file.js, there should be only one unit indent
            const totalIndent = (len - 1) * indentation;

            files[i] = `${' '.repeat(totalIndent)}${format(list[len - 1])}${slash}`;
        }

        return files;
    }
}

module.exports = FlatTreePrinter;
