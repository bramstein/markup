## Review of "jQuery UI 1.6: The User Interface Library for jQuery" by Dan Wellman
<figure>
![](jquery-ui.png)
</figure>

In the last few months I've been developing a new (work) project and decided to give the [jQuery UI library](http://jqueryui.com/) a try. I had been using the UI library for a couple of weeks before I started reading ["jQuery UI 1.6: The User Interface Library for jQuery"](http://www.packtpub.com/user-interface-library-for-jquery/book), and I'm perhaps not the typical target audience, so keep that in mind while reading the review.

The first thing that stood out as I started reading were the type setting conventions. I usually skip these as they are pretty much the same in most books, but somehow in this book they almost take up two pages, in what could have been four lines. Odd.

The book starts with an introduction to the UI library, and goes over downloading the library, setting up a environment, themes, the different widgets and such. It also explains the structure of the library, such as widgets, components and code saving interaction helpers. In my opinion it fails to clearly define these terms. Components, widgets and interaction helpers are used almost interchangeably. To be fair, this seems to be a problem with the jQuery UI library where behaviours such as resizing are also grouped under widgets (or components) and not the book. In this review I will use the terms component (tabs, dialogs, sliders, etc.) and behaviour (resizing, selecting, drag and drop, etc.) from this point on to avoid confusion.

## Components

Chapters two trough seven each describe a component: tabs, accordion, dialog, slider, date picker, and auto complete (note that the auto complete component has been removed from the jQuery UI library.) Each chapter explains how to use said component; from basic usage it walks the reader through the more advanced options and methods and the various styling options. The chapters then conclude with a "Fun with …" section, which builds a small sample application demonstrating each component. Each component option is explained clearly and usually demonstrated in a sample application. Perhaps it is a personal pet peeve, but again the examples are very large and take up a lot of unnecessary space. I think a lot of these multi-page examples could have been simplified by simply showing what has changed with as little context as possible. Instead, the book usually reproduces the whole code listing with changes highlighted in bold. This includes the parts that are (almost) never modified such as the page header and script inclusions.

## Behaviours

The next four chapters describe the behaviours in the UI library: drag and drop, resizing, selecting, and sorting. These chapters take the same approach as the preceding ones: a basic example, styling options, overview of all methods and options, and a "Fun with …" section. I personally would have put these chapters at the beginning of the book as they are used internally in the components and vital to understanding how and why the components work. The book then could have progressed by building a simple custom component using these behaviours before moving on to the built-in components.

## Conclusion

The book concludes with a chapter on the visual effects that come with the UI library. I don't have much to say about this chapter, except that roughly the same information can be found on the jQuery UI website, including live examples of the effects in question. One thing I would have liked to see in this book is an overview of the design philosophy and choices of the UI library. A small chapter that explains why things are done in a certain way would have been a valuable addition to this book.

I think the book's biggest problem is that it covers version 1.6 of the jQuery UI library. [jQuery UI version 1.7](http://jqueryui.com/) has since been released and is different on several points (such as [theming, available options, and methods](http://blog.jqueryui.com/2009/03/jquery-ui-17/).) Version 1.7 has also removed the auto complete component and introduced a new [progress bar component](http://jqueryui.com/demos/progressbar/) which is not covered in this book. Furthermore, the default theme used in the book has been deprecated and is no longer available. The jQuery UI team has published an [upgrade guide from 1.6 to 1.7](http://jqueryui.com/docs/Upgrade_Guide).

It is not a bad book, but I think it would have been better off as either an online tutorial or a wiki so it has a chance to stay up to date with the development of jQuery UI. The extensive code examples also would have worked better with a website instead of a book.
