karma-reference
===============

Karma plugin. LIghtweight dependencies tracking for js and coffee files via references.

Inspired by [Cassette references](http://getcassette.net/documentation/v2/asset-references)

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
**Note: this breaks watching of adding new files, because initial globs are resolved to filelist.**

## File paths
File path could be:
* Relative path like ```@reference ../../dir/file.coffee```.
* Absolute path like ```@reference ~/dir/file.js``` which is resolved agains karma config basePath.

