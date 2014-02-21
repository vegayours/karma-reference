karma-reference
===============

Karma plugin. LIghtweight dependencies tracking for js and coffee files via references.

## Installation
add 'reference' to karma config frameworks section

## Add references
Specify references to other files at comments

for js: 
```
// @reference <file1_path> <file2_path>
```
for coffee:
```
# @reference <file1_path> <file2_path>
```

Now your files would be loaded in sorted by reference dependencies order.

## File paths
File path should be relative to current file path, use forward slashes.
Path like ```@reference ../../dir/file.coffee``` also supported.
