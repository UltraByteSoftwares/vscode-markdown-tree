class OptionsManager {
    static _instance = null;

    static getInstance() {
        if (!OptionsManager._instance)
            OptionsManager._instance = new OptionsManager();
        
        return OptionsManager._instance;
    }
    
    constructor() {
        this._options = {
            folders: {
                formatting: {
                    indentation: 4,
                    branchlines: "├─"
                },
                explorer: {
                    ignore: "",
                    recursive: true,
                    maxdepth: -1,
                    trailingSlash: false
                }
            }
        }
    }

}