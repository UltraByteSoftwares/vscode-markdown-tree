const TreeDecorator = require('../src/tree-decorator');

const assert = require('assert');

suite('Tree decorator', () => {
    // vscode.window.showInformationMessage('Start all tests.');
    test('Sorted items', () => {
        const input = [
            'lorem',
            '    ipsum',
            '    dolor',
            '        sit',
            '            amet',
            '                consectetur',
            '            adipiscing',
            '        elit',
            '    sed ',
            '        do ',
            '        eiusmod ',
            '        tempor ',
            '            incididunt ',
            '    ut ',
            '    labore ',
            '        et'
        ];
        
        const ref = [
            'lorem',
            '├── ipsum',
            '├── dolor',
            '│   ├── sit',
            '│   │   ├── amet',
            '│   │   │   └── consectetur',
            '│   │   └── adipiscing',
            '│   └── elit',
            '├── sed ',
            '│   ├── do ',
            '│   ├── eiusmod ',
            '│   └── tempor ',
            '│       └── incididunt ',
            '├── ut ',
            '└── labore ',
            '    └── et'
        ]

        const dec = new TreeDecorator();
        const output = dec.decorate(input);

        assert.deepStrictEqual(output, ref);
    });
});
