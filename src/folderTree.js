const {readdir} = require('fs/promises');
const path = require('path');

class DirectoryPrinter {
    /**
     * @param {string} name 
     * @param {number} depth 
     * @param {boolean} [lastChild=false] 
     */
    _getDecoratedLine(name, depth, lastChild = false) {
        let line = '';
        
        const {last, horizontal, vertical, middle, indentation, emptyStr, offset} = this._options;
        const padding = `${vertical}${emptyStr.repeat(indentation - vertical.length)}`.repeat(depth - 1);

        const horizRepeat = indentation - `${middle}${emptyStr}`.length;
        const marker = lastChild ? last : middle;
        line = `${emptyStr.repeat(offset)}${padding}${marker}${horizontal.repeat(horizRepeat)} ${name}`;

        return line;
    }

    /**
     * 
     * @param {string} filepath 
     * @param {number} depth 
     */
    async _getChildren(filepath, depth) {
        try {
            if (this._options.maxlevel && depth > this._options.maxlevel)
                return;

            const contents = await readdir(filepath, {withFileTypes: true});
    
            for (let i = 0; i < contents.length; ++i) {
                const content = contents[i];

                // If exclusion is present
                if (this._options.exclude) {
                    if (content.name.search(this._options.exclude) !== -1)
                        continue;
                }
    
                // index = lines.length does not exist but will exist after pushing into it
                const line = this._getDecoratedLine(content.name, depth, i === contents.length - 1 ? true: false);
                // Simply get the item name
                this._lines.push(line);
                
                // Now get the children
                if (content.isDirectory())
                    await this._getChildren(path.join(filepath, content.name), depth + 1);
            }
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
        this._lines = [];
        
        // reset the options
        this._options = {
            offset : 0,
            exclude : null,
            maxlevel : null,   /* max level of recursion */
            last : '└',
            middle : '├',
            horizontal : '─',
            vertical : '│',
            emptyStr : ' ',
            indentation : 4
        }

        Object.assign(this._options, opts);
        const {emptyStr, offset, indentation} = this._options;

        // 2 is the minimum indentation allowed
        this._options.indentation = indentation < 2 ? 2 : indentation;

        this._lines.push(`${emptyStr.repeat(offset)}${path.basename(filepath)}`);

        try {
            await this._getChildren(filepath, 1, this._lines);
        } catch (err) {
            console.error(err);
        }

        return this._lines.join('\n');
    }
}

const dir = new DirectoryPrinter();
dir.print('./', {
    exclude: /(^\.|node_modules)/, 
    maxlevel: 4, 
    offset: 4,
    indentation: 4
})
.then(res => {
    console.log(res);
});