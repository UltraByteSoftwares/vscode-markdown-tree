const FlatTreePrinter = require('../src/flat-tree-printer');

const assert = require('assert');

suite('Tree printer', () => {
    // vscode.window.showInformationMessage('Start all tests.');
    test('Sorted items', () => {
        const input = [
            'CHANGELOG.md',
            'LICENSE',
            'README.md',
            'jsconfig.json',
            'package-lock.json',
            'package.json',
            'res/',
            'res/logo.png',
            'src/',
            'src/directory-printer.js',
            'src/extension.js',
            'src/iterators.js',
            'src/tree-printer.js',
            'style/',
            'style/branched.css',
            'test/',
            'test/extension.test.js',
            'testing.mjs'
        ];

        const ref = [
            'CHANGELOG.md',
            'LICENSE',
            'README.md',
            'jsconfig.json',
            'package-lock.json',
            'package.json',
            'res/',
            '    logo.png',
            'src/',
            '    directory-printer.js',
            '    extension.js',
            '    iterators.js',
            '    tree-printer.js',
            'style/',
            '    branched.css',
            'test/',
            '    extension.test.js',
            'testing.mjs'
        ]

        const printer = new FlatTreePrinter();
        const output = printer.print(input);

        assert.deepStrictEqual(output, ref);
    });
});
