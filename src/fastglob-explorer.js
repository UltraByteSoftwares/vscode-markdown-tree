// Uses the fast-glob package from npm
const fg = require('fast-glob');
const path = require('path');
const OptionsManager = require('./options-manager.js')

class FastGlobExplorer {
    getDefaultOptions() {
        return {
            // Indirect options
            recursive: true,
            // Direct options
            ignore: "",     /* semi-colon separated values */
            deep: -1,
            markDirectories: false
        }
    }

    /**
     * Gets all the files and folders in a path and returns
     * a sorted list of files
     * @async
     * @param {string} folderpath 
     * @param {*} [options=null] 
     * @returns {string[]} A flat list of files
     */
    async getFiles(folderpath, options = null) {
        const {ignore, recursive, deep, markDirectories} = 
            OptionsManager.copyOptions(this.getDefaultOptions(), options);
    
        const baseName = path.basename(folderpath);
        const pattern = recursive ? '**' : '*';

        const files = await fg.async(`${baseName}/${pattern}`, {
            cwd: path.dirname(folderpath),
            onlyFiles: false,
            dot: true,
            baseNameMatch: true,
            // User configurable options
            ignore: ignore.split(';').map(s => s.trim()).filter(s => s !== ''),
            deep: deep === -1 ? Infinity : deep,
            markDirectories: markDirectories
        });

        files.sort();
        files.unshift(baseName);
        
        return files;
    }
}

module.exports = FastGlobExplorer;