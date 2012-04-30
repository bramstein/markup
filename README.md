A source file is a markdown file, which can be accessed in the template by {{article}}. You can specify additional meta data by having a JSON file with the same name. Global meta-data goes into site.json.

Templates are mustache files, with the same name as a file or directory in the source directory. Templates have access to global and source meta-data as well as the article data (if any.) Creating reusable templates is possible through the use of partials, which go into the partials directory. These are template fragments.

All files in the template directory that are not mustache files are copied verbatim to the output directory.
