Markup: a static site generator
===============================
A source file is a markdown file, which can be accessed in the template by {{article}}. Global meta-data goes into site.json.

Templates are mustache files, with the same name as a file or directory in the source directory. Templates have access to global and source meta-data as well as the article data (if any.) Creating reusable templates is possible through the use of partials, which go into the partials directory. These are template fragments.

All files in the `src` directory that are not markdown files are copied verbatim to the output directory. Files other than templates in either the partials or template directory are ignored.

Template fallback works as follows. Given an input file:

   some/dir/content.md

The following templates are tried in order:

    some/dir/content.html
    some/dir.html
    some.html

If there is no fallback at the root, the source file is ignored.
