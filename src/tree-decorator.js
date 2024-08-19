const OptionsManager = require('./options-manager.js');

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
    size() {
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
    get(index, beyondTop = false) {
        const top = beyondTop ? this._stack.length - 1 : this._top;
        if (index > top)
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

    getDefaultOptions() {
        return {
            endmark : '└',
            midmark : '├',
            hline : '─',
            vline : '│',
            empty : ' ',
            hgap: 1
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
     * Decorates a tree with branch lines. The same passed in array 
     * is mutated and returned.
     * @param {string[]} lines 
     * @param {*} [options=null] 
     * @returns {string[]} decorated string array
     */
    decorate(lines, options = null) {
        if (!lines || lines.length < 2)
            return lines;

        const {midmark, hline, hgap, vline, endmark} =
            OptionsManager.copyOptions(this.getDefaultOptions(), options);
        
        const offset = this._getPadding(lines[0]);
        const indentation = this._getPadding(lines[1]) - offset;

        const dstack = new DepthStack();
        dstack.push(0);

        /**
         * 
         * @param {string} marker 
         * @param {number} d 
         * @param {number} lineNum 
         */
        const applyMarker = (marker, d, lineNum) => {
            const hRepeat = indentation - midmark.length - hgap;
            TreeDecorator.insertAtPosition((d - 1) * indentation, lines, lineNum, lineNum + 1, 
                `${marker}${hline.repeat(hRepeat)}`);
        }

        let depth = 0;
        let prevTop = dstack.size();

        for (let i = 1; i < lines.length; ++i) {
            const line = lines[i];

            depth = this._getDepth(line, indentation, offset);

            // get the sibling if any
            const siblingLineNum = dstack.get(depth);

            prevTop = dstack.size();

            // push itself makes sure the difference in depth is not greater than 1
            if (!dstack.push(i, depth))
                throw new Error(`Error: Bad indentation at item number ${i + 1} of the tree.`);

            if (siblingLineNum !== null) {
                // If there was a previous sibling, print a vertical line to the current line
                TreeDecorator.insertAtPosition((depth - 1) * indentation, lines, siblingLineNum + 1, i, vline);
            }

            applyMarker(midmark, depth, i);

            // Now change markers for leaf nodes if any. This is a loop for items in the dstack
            // invalidated by the 'push' above
            for (let d = dstack.size(); d < prevTop; ++d) {
                applyMarker(endmark, d, dstack.get(d, true));
            }
        }

        /* At the end whatever entries remain in the depth stack are leaf nodes
        thus need to change their markers */
        for (let d = 1; d < dstack.size(); ++d) {
            applyMarker(endmark, d, dstack.get(d, true));
        }

        return lines;
    }
}

module.exports = TreeDecorator;