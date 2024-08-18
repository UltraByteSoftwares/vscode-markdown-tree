// Uses the fast-glob package from npm
const fg = require('fast-glob');
const path = require('path');

class FastGlobExplorer {
    /**
     * Gets all the files and folders in a path and returns
     * a sorted list of files
     * @async
     * @param {string} folderpath 
     * @param {*} [options=null] 
     * @returns {string[]} A flat list of files
     */
    async getFiles(folderpath, options = null) {
        const opts = {
            cwd: path.dirname(folderpath),
            onlyFiles: false
        };
    
        if (options)
            Object.assign(opts, options);
    
        const files = await fg.async(`${path.basename(folderpath)}/**`, opts);
    
        return files.sort();
    }
}

module.exports = FastGlobExplorer;