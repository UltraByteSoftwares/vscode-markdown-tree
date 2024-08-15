const {readdir, access} = require('fs/promises');
const path = require('path');

class DirectoryPrinter {
    /**
     * Modifies the supplied lines array
     * @param {string[]} lines 
     * @param {number} start 
     * @param {number} end 
     * @param {number} column The actual character column (not depth) in the string
     * @param {string} charStr 
     */
    _insertInLines(lines, start, end, column, charStr) {
        if (end > lines.length)
            throw new Error(`Value of end (${end}) > lines.length (${lines.length})`);

        for (let i = start; i < end; ++i) {
            const line = lines[i];

            if (column > line.length)
                throw new Error(`String length (${line.length}) < ${column}`);

            const p1 = line.substring(0, column);
            const p2 = line.substring(column + charStr.length);

            lines[i] = p1 + charStr + p2;
        }
    }

    /**
     * @param {string} name 
     * @param {number} depth 
     * @param {boolean} [lastChild=false] 
     */
    _getDecoratedLine(name, depth, lastChild = false) {
        const {last, horizontal, middle, indentation, emptyStr, offset} = this._options;
        const padding = emptyStr.repeat(offset + indentation*(depth - 1));

        const horizRepeat = indentation - `${middle}${emptyStr}`.length;
        const marker = lastChild ? last : middle;
        return `${padding}${marker}${horizontal.repeat(horizRepeat)} ${name}`;
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

            const {vertical, indentation, offset} = this._options;
            let prevSiblingIndex = 0;
    
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
                
                // If there was a previous sibling, draw a vertical line from the previous sibling to the the current sibling
                if (prevSiblingIndex) {
                    this._insertInLines(this._lines, prevSiblingIndex + 1, this._lines.length - 1, offset + indentation*(depth - 1), vertical);
                }
                
                prevSiblingIndex = this._lines.length - 1;

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
        if (!filepath)
            throw new Error("Supplied folder path is undefined");

        try {
            await access(filepath);
        } catch (error) {
            throw new Error(`Error: Folder "${filepath}" does not exist or is not accessible`);
        }

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
        const {indentation} = this._options;

        // 2 is the minimum indentation allowed
        this._options.indentation = indentation < 2 ? 2 : indentation;

        this._lines.push(`${path.basename(filepath)}`);
    
        await this._getChildren(filepath, 1, this._lines);
        return this._lines.join('\n');
    }
}

module.exports = DirectoryPrinter;
