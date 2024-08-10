# Markdown Tree extension for Visual Studio Code

Generate collapsible/expandable trees in markdown

## Features

- Generate trees from space/tab indented text
- Supports generating trees from the output of `tree` command

### Preview

![markdown tree preview](./res/demo.png)

## Usage

- Write your tree items inside `ultree` fenced code block

    <pre>
    ```ultree
        RootFolder
            LICENSE
            package.json
            src
                main.js
    ```</pre>
  
- Use either tabs or spaces to indent (but not both together inside `ultree` block)

## Options
Options can be specified as `key: value` pairs at the beginning of the body of `ultree` block.

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
