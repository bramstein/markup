date: Sat, 11 Jul 2009 18:43:50 +0100
tags: monkeys, penguins


# Getting started

## Installing

Download the latest version of the library and unzip it to a directory of your choosing. This article assumes you unzipped it to `/Libraries/UI` .

### Directory structure

The following directory structure is used in the source distrubution.
* 
 `library/Include` 

The include directory contains all the source code of the GUI library. It has six sub directories which also correspond with the namespaces used in the GUI library.
* 
 `library/Include/border` 

The border directory contains all files related to rendering borders.
* 
 `library/Include/component` 

The component directory contains all widgets, such as Buttons, Labels and MenuItems.

Please note that while all other directories have corresponding namespaces, the classes in the component directory are members of the ui namespace, and thus do not have a seperate ui::component namespace.
* 
 `library/Include/event` 

The event directory contains all event and listener interfaces in the library.
* 
 `library/Include/layout` 

The layout directory contains all layout managers.
* 
 `library/Include/theme` 

The theme directory contains the default and basic themes. Alternative themes do not have to be placed in the same directory.
* 
 `library/Include/util` 

The util directory contains utility classes required for the GUI library, such as classes to represent points, rectangles and colors.
* 
 `library/lib` 

Contains the prebuilt (Windows) static library files.

### Setting up your environment

You have to add the GUI library to the "include" and "library" directories of your compiler so that it can find the header files and static libraries to link against. An alternative is to place the GUI library in a subfolder of your project, but I recommend against this, because it makes upgrading to newer versions more difficult.

If you use [Microsoft Visual Studio .NET 2003 or above](http://msdn.microsoft.com/vstudio/) , this is quite easy. Open up the IDE and go to the "Tools" menu. From there, select "Options". In the dialog box that pops up, open the "Projects" folder in the tree view and select "VC++ Directories". Using the "Show directories for: " dropdown box in the upper right corner, select "Include folders" and create a new field for `C:\Libraries\UI\Library\Include` . Do the same for "Library files", but refer to `C:\Libraries\UI\Library\Lib` . Hit OK and you're done.

If you're using XCode (Mac OS X) it is even easier. Download the framework distribution and unzip it to `/Library/Frameworks/` or `~/Library/Frameworks/` . In XCode, use the "add existing framework" option to add the library to your project. Also add the framework to your "copy" and "link" action in your application's target. That's all.

For other IDE's and compilers, consult the manual of your compiler or IDE on how to do this.

## Compiling

If you need to change something in the library, or wish to compile it on a different compiler, you'll need to read this chapter. You might also want to rebuild the static libraries if you want to use different C++ runtime libraries; for example, the single-threaded runtime.The prebuilt static libraries use the multi-threaded DLL runtime, which is required for projects that use the [Simple Directmedia Layer](http://www.libsdl.org) library (SDL). This is only required if you actually use SDL in your program, the GUI library itself does not require it.

### Requirements

The requirements for compiling depend on which package you downloaded, both packages however require the following:* 
A recent C++ compiler.

The library has been tested and developed on MSVC7.1, MSVC8.0 and XCode 2.1(GCC 4.0). Other compilers might work as well, as no exotic C++ constructs or features are used. If you get it working on other compilers, please let me know.
* 
A good standard template library implementation.

This usually comes with your C++ compiler (as it is part of C++), but not all implementations are adhering to the standard (MSVC6.X comes to mind). [STLPort](http://www.stlport.org) is a good alternative if the implementation that comes with your compiler does not work properly.
* 
An OpenGL 1.1 or higher implementation.

The library uses OpenGL to render to the screen and thus requires OpenGL to be present on your system. The library only uses standard OpenGL 1.1 functions, no extensions are required.
Additionally, the UIDemo demo application requires the following installed on your system:* 
Simple Directmedia Layer (SDL).

The UIDemo application requires SDL 1.2.X installed, as it is used to set up the window and handle input.
* 
Simple Directmedia Layer image library.

The [SDL_image](http://www.libsdl.org/projects/SDL_image/) library is used to load the font image and is thus required for compiling the UIDemo application. Please note that the SDL_image library should be compiled for the SDL version you are using (incompatible versions will result in errors.)
Finally, the UITest application requires the following to be installed on your system:* 
Simple Directmedia Layer (SDL).

The UIDemo application requires SDL 1.2.X installed, as it is used to set up the window and handle input.
* 
Freetype 2.

 [Freetype](http://www.freetype.org/) 2 is used for font rendering in the UITest application and is thus required for compiling.


### Compiling with Microsoft Visual Studio .NET 2003

If you have Microsoft Visual Studio .NET 2003 or above, you can simply open the solution in the root directory ( `/Libraries/UI` ) and hit compile. This should compile the library.

### Compiling with XCode 2.1

There is an XCode project included in the source distribution, which should work with XCode 2.1 or above.

### Compiling with other compilers

Since there are no project files for other IDE's, you'll have to create these yourself. To do this, create a new, empty project in your IDE of choice and mimic the folder structure in `/Libraries/UI/Library/Include` . Also add all the header (*.h) and C++ (*.cpp) files to it.

Next, set the output directory of the static libraries to `/Libaries/UI/Lib/Release` and `/Libraries/UI/Lib/Debug` . Set the output filename of the Release build to `UI.lib` and the Debug build to `UId.lib` (the appended 'd' indicates it is a build containing debug information.) Add a post-build macro (or something similar) that moves the libraries to the `/Libraries/UI/Lib` directory after they are compiled, and you're done.

Note that you don't actually have to stick to this directory structure. If you know what you're doing, you're free to change the structure or place the libraries wherever you please.

## Building a simple application

This chapter outlines the basics for building a simple application using the GUI library, or integrating it with an existing application. The code for this can be found in the UIDemo demo application. To start, link the release build of your program with the `UI.lib` , and the debug build with `UId.lib` static library files.

### Setting up your application

Create an instance of the `Gui` class. There should only be one `Gui` instance in your whole program, as it provides a single entry point for communication with the library. Having only one `Gui` instance does not mean you can only have one user interface in your program; you can have multiple `Frame` instances, which are in essence root nodes for user interfaces.

To make the library work correctly you need to pass several input parameters to the `Gui` instance so that all user interfaces in your program receive mouse and keyboard input and timing information. Assuming you have created an instance of `Gui` , named `guiInstance` you should pass parameters like so:

    // send frame delta time
    guiInstance->importUpdate(deltaTime);
    
    // send mouse x and y coordinates
    guiInstance->importMouseMotion(x,y);

These two import methods need to be called and updated every frame. The delta time is the time between the last and current frame in milliseconds, and is used to correctly calculate animations and interpolations in the GUI. The mouse coordinates are simply the current X and Y mouse coordinates. Besides these two methods, there are four other import methods related to mouse and keyboard events that need to be called, but only when their respective events occur.

    // send mouse button released events
    guiInstance->importMouseReleased(button);
    
    // send mouse button pressed events
    guiInstance->importMousePressed(button);
    
    //send key release event
    guiInstance->importKeyReleased(key,modifier);
    
    // send key pressed event
    guiInstance->importKeyPressed(key,modifier);

The mouse related import methods only take one parameter, the button that was pressed. Valid values are `MOUSE_BUTTON1` , `MOUSE_BUTTON2` , `MOUSE_BUTTON3` , `MOUSE_SCROLL_UP` and `MOUSE_SCROLL_DOWN` and can be found in `event/MouseEvent.h` . For a right handed mouse this translates into the left mouse button, the right mouse button, and optionally a third button, scroll wheel up and scroll wheel down respectively.

The key related import methods both take two parameters, the key code and modifier code. The key code is the code of the key that was pressed or released and the modifier code the modifier that was active while that key was pressed (such asshiftorctrl.) Valid values can be found in `event/KeyEvent.h` . Note that most key codes correspond to the official ASCII key codes, which should simplify sending key events from your application.

There are a few other important methods you need to call in order to use the library, such as the paint method which will be discussed in the next section. There are also several methods related to the font engine. Writing and setting up a font engine is required for components that render text to the screen (which almost all components do) and is discussed in a [seperate article](fontengine.html) .

The last two methods of the GUI class are `addFrame` and `removeFrame` . Using these two methods you can add or remove Frame instances to your user interface. Adding a Frame ensures that it receives all user input and gets rendered in the proper order. Removing it stops all user input and rendering for that `Frame` . If you wish to disable an user interface, it is preferred to disable it by calling the `hide` method on it. This will hide the `Frame` , but does not remove it from the `Gui` instance. Note that a `Frame` is initially hidden so you'll have to call the `show` method for it to display.

### Setting up OpenGL

To render the GUI, you'll need to set up OpenGL before calling the paint method of your `Gui` instance. This is as simple as switching to orthographic mode and calling the paint method, as shown in the example below.

    // go to orthographic mode
    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    gluOrtho2D(0,width,height,0);
    glMatrixMode(GL_MODELVIEW);
    
    // paint the Gui
    guiInstance->paint();
    
    // switch back to perspective mode
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);

Especially note the `gluOrtho2D` call, which is slightly unusual in that it sets up the 0,0 point in the upper left corner, instead of the OpenGL default of having the 0,0 point in the lower left corner. This is because the GUI uses the upper left corner as its 0,0 point. This also means that any custom painting in the GUI or derived classes have to take this into account.

If you are using `glOrtho` instead of `gluOrtho2D`  *make sure that the depth range is from -1 to 1* , as this is required for the GUI to operate correctly.

In order for blending to work (which is used by most font engines and the default theme of the Menu component) you might also wish to set the blending function to `GL_SRC_ALPHA,
      GL_ONE_MINUS_SRC_ALPHA` using `glBlendFunc` . Your GUI should now render and function properly.
