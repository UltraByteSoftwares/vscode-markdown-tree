const {readdir} = require('fs/promises');
const path = require('path');

class DirectoryPrinter {
    async _getChildren(filepath, depth, options) {
        try {
            const contents = await readdir(filepath, {recursive: true, withFileTypes: true});
    
            let children = '';
            for (const content of contents) {
                // If exclusion is present
                if (options.exclude) {
                    if (content.name.search(options.exclude) !== -1)
                        continue;
                }
    
                // If it is not a directory, simply get the item name.
                // If it is a directory, get the item name (of course) and its children
                children += `${' '.repeat(4*depth)}${content.name}\n`;

                if (content.isDirectory())
                    children += await this._getChildren(path.join(filepath, content.name), depth + 1, options)
                    
            }

            return children;
          } catch (err) {
            console.error(err);
          }    
    }

    /**
     * 
     * @param {string} filepath 
     * @param {Object} opts 
     */
    async print(filepath, opts) {
        // reset the options
        const options = {
            offset : 0,
            exclude : null,
            level : null,
            end : '└',
            middle : '├',
            horizontal : '─',
            vertical : '│'
        }

        Object.assign(options, opts);
        let output = `${path.basename(filepath)}\n`;
        output += await this._getChildren(filepath, 1, options);

        return output;
    }
}

const dir = new DirectoryPrinter();
dir.print('./', {exclude: /(^\.|node_modules)/})
.then(res => {
    console.log(res);
});