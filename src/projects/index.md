# Programming and design projects

##  [TeX line breaking algorithm in JavaScript](typeset/) 

This is an implementation of the Knuth and Plass line breaking algorithm using JavaScript and the HTML5 canvas element. The goal of this implementation is to optimally set justified text in the new HTML5 canvas element, and ultimately provide a library for various line breaking algorithms in JavaScript.

##  [JavaScript Preprocessor](preprocess/) 

A simple JavaScript preprocessor to enable conditional compilation in JavaScript code with the syntax of the C preprocessor. Conditional compilation makes it easy to generate multiple versions of your project to―for example―create a debug build, or a specialized version designed to work in restrictive environments.

##  [jQuery Text Alignment plugin](http://www.bramstein.com/projects/text-align/) 

Imagine you have worked hard to make your tables look good, but one thing keeps bugging you; the alignment of the text in the cells. You would, for example, like to align the contents of each cell on the comma character. Unfortunately, no browser supports aligning table cells on characters. This is where the [jQuery Text Alignment Plugin](http://www.bramstein.com/projects/text-align/) comes in; it adds support for aligning text based on characters to all browsers.

##  [jQuery CSS3 text overflow plugin](text-overflow/) 

This jQuery plugin implements a simplified version of the [CSS3 text-overflow](https://developer.mozilla.org/en/CSS/text-overflow) property. The `text-overflow` property allows stylesheet authors to specify how and where text should be clipped. This is usually done by adding an ellipsis character " `…` " or three dots at the point the text should be cut off. Unfortunately, not all browser support this CSS property, and this plugin was designed to simulate it when not natively available.

##  [jQuery column cell selector](column/) 

This jQuery plugin adds a new selector to the selector API for retrieving table cells by their column index. It supports tables with column and row spans transparently, no matter how complex a table is. The syntax for selecting column cells is simple and similar to other jQuery selectors. The selector can take several types of arguments for selecting columns, such as keywords, numeric indexes, and equations.

##  [Functional Pattern Matching in JavaScript](jfun/) 

Pattern matching is a form of conditional branching which allows you to concisely match on data structure patterns and bind variables at the same time. Pattern matching is supported in some functional languages such as ML, Haskell, OCaml, and Erlang. This library implements pattern matching for the JavaScript language in an efficient and concise way.

##  [jLayout ― JavaScript Layout Algorithms](jlayout/) 

The [jLayout JavaScript library](jlayout/) provides layout algorithms for laying out components and containers. The library currently provides three layout algorithms: `border` , which lays out components in five different regions; `grid` , which lays out components in a user defined grid; and flex-grid which lays out components in a user defined grid with flexible column and row sizes. A [jQuery plugin](jlayout/jquery-plugin.html) to lay out (X)HTML elements is also available.

##  [JUnify ― JavaScript Unification Library](junify/) 

JUnify is a JavaScript library for performing unification on objects and arrays. Unification is an algorithm to determine the substitutions needed to make two expressions match. If the expressions contain variables, these will be bound to values in order for the match to succeed. If two expressions are not identical or the variables can not be bound, the match fails. Unification can, for example, be used to [implement pattern matching](../articles/pattern-matching.html) or an expert system.

##  [JSizes ― jQuery CSS size properties plugin](jsizes/) 

JSizes is a small plugin for the [jQuery JavaScript library](http://jquery.com/) which adds support for the CSS  `min-width` , `min-height` , `max-width` , `max-height` , `border-*-width` , `margin` , and `padding` properties. Additionally it has one method for determining whether an element is visible. Because all the size methods return numbers, it is safe to use them in calculating DOM element dimensions.

##  [XSLTJSON ― XML to JSON transformations](xsltjson/) 

XSLTJSON is an XSLT 2.0 stylesheet to transform arbitrary XML to [JavaScript Object Notation](http://json.org/) ( JSON ). JSON is a lightweight data-interchange format based on a subset of the [JavaScript language](http://en.wikipedia.org/wiki/JavaScript) , and often offered as an alternative to XML in—for example—web services. To make life easier XSLTJSON allows you to transform XML to JSON automatically.

XSLTJSON supports several different JSON output formats, from a compact output format to support for the [BadgerFish convention](http://badgerfish.ning.com/) , which allows round-trips between XML and JSON .

##  [OpenGL GUI Library](gui/) 

A Graphical User Interface (GUI) library for prototyping and building game user interfaces. It is based on OpenGL and written in (portable) C++. The library is completely free and open-source. Other features include:
* 
widgets such as buttons, scrollbars, menuitems, textfields, etc.
* 
ability to modify and create custom themes
* 
can be used as an in-game texture (see UITest in the demo's)
* 
API similar to Java Swing API

Unfortunately, as my spare time is limited, this project is currently on hold and no longer maintained.

##  [Quake Menu Textures](quake/) 

A set of high resolution Quake1 menu textures for use with [modern Quake1 engines](http://wiki.quakesrc.org/index.php/Engines) such as [Darkplaces](http://www.icculus.org/twilight/darkplaces/) . The design goal for these textures was to make them as close to the original textures as possible, but with a higher resolution.
