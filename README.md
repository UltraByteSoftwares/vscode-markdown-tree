# Markdown Tree extension for Visual Studio Code

This extension enables you to generate expandable/collapsible trees in markdown

## Features

- Generate trees from space or tab indented text
- Also supports generating trees from the output of `tree` command

### Preview

![markdown tree preview](./res/demo.png)

## Usage

- Create collapsible HTML trees with `ultree` fenced code block

    <pre>
    ```ultree
        RootFolder
            LICENSE
            package.json
            src
                main.js
    ```</pre>
  
- Indent the tree items with spaces or tabs (but not both simultaneously within one `ultree` block)
- Pasting the output of `tree` command works as well
- You can also control the output by specifying the options at the beginning of the `ultree` block in `key: value` format as shown in the image above

## Options

Here are the currently supported options

| Option     | Possible values | Description                                        |
| ---------- | --------------- | -------------------------------------------------- |
| **output** | `foldable`      | (default) Output a foldable tree                   |
|            | `simple`        | Output a non-foldable tree                         |
| **open**   | `true`          | (default) Keep foldable tree expanded at the start |
|            | `false`         | Keep foldable tree collapsed at the start          |

## Release Notes

v1.0.0 has been released

### 1.0.0

Initial release of markdown-tree extension
