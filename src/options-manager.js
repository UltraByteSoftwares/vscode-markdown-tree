class OptionsManager {
    static _instance = null;

    static getInstance() {
        if (!OptionsManager._instance)
            OptionsManager._instance = new OptionsManager();
        
        return OptionsManager._instance;
    }

    /**
     * Shallow copy items from source to target only if the key in 
     * source is present in the target.
     * @param {Object} target 
     * @param {Object} source 
     */
    static copyOptions(target, source) {
        for (let key in target) {
            if (key in source)
                Object.assign(target, source);
        }

        return target;
    }

    // Hardcoded settings in the code
    getDefaultConfigs() {
        return {
            folders: {
                formatting: {
                    indentation: 4,
                    branchStyle: "├─"
                },
                explorer: {
                    recursive: true,
                    ignore: "",
                    deep: -1,
                    markDirectories: false
                }
            }
        }
    }

    // Settings in json file
    getUserConfigs() {

    }

    getConfigs() {

    }
}

module.exports = OptionsManager;