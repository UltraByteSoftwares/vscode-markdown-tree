/**
 * This is a class on top of array but where the items are not
 * really popped but only the top position changes
 */
class DepthStack {
    constructor() {
        /** @readonly */
        this._stack = [];
        /** @readonly */
        this._top = -1;
    }

    /**
     * 
     * @returns {number}
     */
    length() {
        return this._top + 1;
    }

    /**
     * 
     * @param {*} replacement 
     * @param {number} index
     * @returns {boolean} 
     */
    replace(replacement, index) {
        if (index > this._top)
            return false;

        // Replace the item
        this._stack[index] = replacement;

        return true;
    }

    /**
     * 
     * @param {number} index
     * @returns {number | null} 
     */
    get(index) {
        if (index > this._top)
            return null;

        return this._stack[index];
    }

    /**
     * Pushing item beyond lastIndex + 1, returns false
     * @param {*} item 
     * @param {number} index 
     * @returns {boolean}
     */
    push(item, index = this._top + 1) {
        if (index > this._top + 1)
            return false;

        // js arrays automatically resize themselves till the index
        this._stack[index] = item;

        this._top = index;
        return true;
    }

    /**
     * Pop all the items until index
     * @param {*} item 
     * @param {number} index
     * @returns {number | null} 
     */
    pop(index = this._top) {
        if (index > this._top)
            return null;

        this._top = index - 1;

        return this._stack[index];
    }
}

class TreeDecorator {
    /**
     * Modifies the supplied lines array
     * @param {number} pos The actual character position (not depth) in the string
     * @param {string[]} lines 
     * @param {number} start 
     * @param {number} end 
     * @param {string} charStr 
     */
    static insertAtPosition(pos, lines, start, end, charStr) {
        if (end > lines.length)
            throw new Error(`Value of end (${end}) > lines.length (${lines.length})`);

        for (let i = start; i < end; ++i) {
            const line = lines[i];

            if (pos > line.length)
                throw new Error(`String length (${line.length}) < ${pos}`);

            const p1 = line.substring(0, pos);
            const p2 = line.substring(pos + charStr.length);

            lines[i] = p1 + charStr + p2;
        }
    }

    constructor() {
        this._options = {
            last : '└',
            middle : '├',
            horizontal : '─',
            vertical : '│',
            emptyStr : ' ',
            indentation : 4,
            hclearance: 1
        }
    }

    /**
     * Gets the padding (i.e. number of space characters) at the
     * beginning of a string
     * @param {string} str 
     * @returns {number}
     */
    _getPadding(str) {
        // Get the first character which is not space character
        return str.search(/[^\s]/);
    }

    /**
     * Get the depth level of a string in a tree list
     * @param {string} str 
     * @param {number} indentation number of spaces in one indentation
     * @returns {number}
     */
    _getDepth(str, indentation, offset) {
        const padding = this._getPadding(str) - offset;
        return padding/indentation;
    }

    /**
     * Decorates a tree with branch lines. The tree must have only one root.
     * @param {string[]} lines 
     * @param {*} [options=null] 
     * @returns {string[]} decorated string array
     */
    decorate(lines, options = null) {
        // Copy the default options
        let opts = {...this._options};
        if (options)
            Object.assign(opts, options);

        // Return if nothing or empty
        if (!lines || !lines.length)
            return lines;
        
        const offset = this._getPadding(lines[0]);

        // If it is the only item, return
        if (lines.length < 2)
            return lines;

        const indentation = this._getPadding(lines[1]) - offset;

        let diff = this._getDepth(lines[1], indentation, offset) -
                    this._getDepth(lines[0], indentation, offset);

        // Difference in depth between first and second elements must be only 1 
        if (diff !== 1)
            return lines;

        /* Depth stack is a stack which keeps track of parents at any time */
        const dstack = new DepthStack();
        dstack.push(0);

        for (let i = 1; i < lines.length; ++i) {
            const line = lines[i];
            const depth = this._getDepth(line, indentation, offset);

            // get the sibling if any
            const siblingLineNum = dstack.get(depth);

            // push itself makes sure the difference in depth is not greater than 1
            if (!dstack.push(i, depth))
                return lines;

            try {
                const {middle, horizontal, hclearance, vertical, last} = this._options;
                const pos = (depth - 1) * indentation;

                if (siblingLineNum !== null) {
                    // Print the vertical branch lines from line after sibling to the current line
                    TreeDecorator.insertAtPosition(pos, lines, siblingLineNum + 1, i, vertical);
                }

                let marker = middle;
                // Check if it is the last child, if yes, marker will be different
                // This item in the current line is the last child if it is the last item in the list
                // or the depth of next line is less than the current one
                if (i === lines.length - 1 || this._getDepth(lines[i + 1], indentation, offset) < depth)
                    marker = last;

                // Print the marker and the item
                const horizRepeat = indentation - marker.length - hclearance;
                TreeDecorator.insertAtPosition(pos, lines, i, i + 1, 
                    `${marker}${horizontal.repeat(horizRepeat)}`);
            } catch (err) {
                return lines;
            }
        }

        return lines;
    }
}

module.exports = TreeDecorator;
