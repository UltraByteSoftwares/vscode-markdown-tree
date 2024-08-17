// Uses the fast-glob package from npm
const fg = require('fast-glob');

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
            cwd: folderpath,
            onlyFiles: false
        };
    
        if (options)
            Object.assign(opts, options);
    
        const files = await fg('**', opts);
    
        return files.sort();
    }
}

module.exports = FastGlobExplorer;

new FastGlobExplorer().getFiles('./', {ignore: ['node_modules']})
    .then(res => {
        console.log(res);
    });