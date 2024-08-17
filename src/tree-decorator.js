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
    constructor() {
        this._options = {};
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
     * @param {number} offset  
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
        const result = [];
        if (!lines || !lines.length)
            return result;
        
        const offset = this._getPadding(lines[0]);
        result.push(lines[0]);

        // If it is the only item, return
        if (lines.length < 2)
            return result;

        const indentation = this._getPadding(lines[1]) - offset;

        let diff = this._getDepth(lines[1], indentation, offset) -
                    this._getDepth(lines[0], indentation, offset);

        // Difference in depth between first and second elements must be only 1 
        if (diff !== 1)
            return result;

        /* Depth stack is a stack which keeps track of parents at any time */
        const dstack = new DepthStack();
        dstack.push(0);

        for (let i = 1; i < lines.length; ++i) {
            const line = lines[i];
            const depth = this._getDepth(line, indentation);

            // push itself makes sure the difference in depth is not greater than 1
            if (!dstack.push(i, depth))
                return result;

            // If difference in lineNums > 1, then make a vertical line
            const parentLineNum = dstack.get(depth - 1);
            if (!parentLineNum)
                return result;

            if (i - parentLineNum > 1) {
                // @TODO code to print vertical lines
            }

            // @TODO Code to print simple marker and the item
        }

        return result;
    }
}

module.exports = TreeDecorator;

// const res = new TreeDecorator().decorate(['lop']);
// console.log(res);

const ds = new DepthStack();
ds.push(70);
ds.push(78);
ds.push(76);
ds.push(75);
ds.push(79);
console.log(ds);

// console.log(ds.pop(3));
// console.log(ds);

console.log(ds.replace(69, 2))
console.log(ds);