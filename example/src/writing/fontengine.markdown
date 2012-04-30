date: Sat, 11 Jul 2009 18:43:50 +0100
tags: monkeys, penguins


# Writing your own font engine

## Introduction

To use components that draw text such as Buttons, Labels and Textboxes you'll need to write your own font engine. There is no default font engine in the library, because they usually require dependencies on other libraries or platform dependant code.

Although writing your own font engine sounds complicated, it is in fact quite simple, as this article will show you. It will guide you through writing a simple bitmap based font engine, and hopefully explain the interface sufficiently so that you can write more complex font engines afterwards.

The code for this article is taken from the UIDemo demo application, which is included in the demo applications download. Let's jump right in!

## Interfaces

You need to implement two interfaces, `Font` and `AbstractFontFactory` , in order to write a font engine. The `Font` interface describes a font in the library and is responsible for creating, rendering and destroying individual fonts. The `AbstractFontFactory` is responsible for managing the fonts in your application, such as the creation of new `Font` instances when the library requests them. The `Font` interface defines four abstract methods (pure virtual functions)—shown below—which you'll need to implement.

    const std::string getFontName() const;
    std::size_t getSize() const;
    util::Dimension getStringBoundingBox(const std::string &text) const;
    void drawString(int x, int y, const std::string &text);

While the method names are pretty self-explanatory, there are some small issues to keep in mind while implementing these methods. The `getFontName` method should return the name of the font belonging to this instance of the `Font` class. This means that the returned font name should be unique and used consistently across calls to the function, because the name and font size are used by the library to determine whether or not a font already exists (and allocate a new font if it does not.) The unit returned by `getSize` can be arbitrary, because the method is—besides the aforementioned identification—never used inside the library. The dimensions returned by the `getStringBoundingBox` method are significant however. They are used by the library to, for example, calculate button dimensions. This method is called very often, so it is a good idea to cache the dimensions of the individual characters instead of calculating them on the fly. The last method, `drawString` should be implemented so that the text is drawn to the screen at the specified X and Y location.

The `AbstractFontFactory` interface has only one abstract method. This method should create instances of your `Font` implementation. The `fontName` parameter is the name of the font. The `size` parameter is the font size.

    Font * createFont(const std::string &fontName, std::size_t size);

For example, the library could request a font named "Arial.ttf" with 12 point size and your `AbstractFontFactory` implementation could proceed by loading Arial.ttf from disk and creating an instance of your `Font` implementation with 12 point size. Alternatively, it could completely ignore the request and always return the same font, with the same font size. This is what we'll do for our bitmap font engine.

## Bitmap font engine

Our BitmapFont header file should look similar to the code fragment shown below. Note the four data members, the width and height of the font texture, the texture identifier and a base index for the display list we are going to use.

    class BitmapFont : public ui::Font
    {
    public:
        BitmapFont();
        ~BitmapFont();
        const std::string getFontName() const;
        std::size_t getSize() const;
        ui::util::Dimension getStringBoundingBox(const std::string &text) const;
        void drawString(int x, int y, const std::string &text);
    private:
        static const int textureWidth = 256;
        static const int textureHeight = 256;
        GLuint textureId;
        GLuint base;
    };

The bitmap we are going to use stores 256 characters. The first 128 characters are standard [ASCII characters](http://www.asciitable.com) and the last 128 are from the [ANSI Extended ASCII standard](http://www.cplusplus.com/doc/papers/ascii.html) and contain mostly special characters found in some non-English languages (such as French, Swedish, Norwegian, etc). On the right an example of such a bitmap.

![](font.png)
<div class="sidebar">
#### Note

Using only 256 characters is fairly short-sighted because languages other than English might use characters beyond the available 256 ASCII characters. Languages such as Japanese and Chinese might not even be stored as single byte characters, but rather as multi-byte [unicode](http://www.unicode.org/) and thus require a wholly different approach. At the moment the GUI library does not support unicode. For this example however, it will work just fine.
</div>
The constructor loads the image, loops through it and creates a display list for each character. Note that the the identifiers for the display lists correspond with the numeric values of the [ASCII table](http://www.asciitable.com) . For example, uppercase 'A' has identifier 65 in the ASCII table and in the display lists. Note that we use a base number as offset in case OpenGL has already allocated other display list identifiers.

    
    BitmapFont::BitmapFont()
    {
        // This uses the SDL_Image library to load a PNG file
        SDL_Surface *font = IMG_Load("Font.png");
    
        glEnable(GL_TEXTURE_2D);
        glGenTextures(1,&textureId);
        glBindTexture(GL_TEXTURE_2D,textureId);
    
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, font->w, font->h, 0, GL_RGBA, 
                     GL_UNSIGNED_BYTE, font->pixels);
    
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    
        float cx;
        float cy;
    
        base = glGenLists(256);
        
        for(int i = 0; i < 256; i++)
        {
            cx = float(i%16)/16.0f;
            cy = float(i/16)/16.0f;
    
            glNewList(base+i,GL_COMPILE);
            glBegin(GL_QUADS);
                glTexCoord2f(cx,cy+0.0625f);
                glVertex2i(0,16);
                glTexCoord2f(cx+0.0625f,cy+0.0625f);
                glVertex2i(16,16);
                glTexCoord2f(cx+0.0625f,cy);
                glVertex2i(16,0);
                glTexCoord2f(cx,cy);
                glVertex2i(0,0);
            glEnd();
            glTranslated(10,0,0);
            glEndList();
        }
        glDisable(GL_TEXTURE_2D);
    
        SDL_FreeSurface(font);
    }
    
    BitmapFont::~BitmapFont()
    {
        glDeleteTextures(1,&textureId);
        glDeleteLists(base,256);
    }

The rest of the `Font` implementation is quite simple and shown below. We draw the text by translating to the X, Y coordinates and call the display lists by using the ASCII values of our string. The `getFontName` and `getSize` methods return a fixed value, and the `getStringBounding` method returns the width as &lt;number of characters&gt; * &lt;font size&gt; and height as &lt;font size&gt;.

    void BitmapFont::drawString(int x, int y, const std::string &text)
    {
        glEnable(GL_TEXTURE_2D);
        glBindTexture(GL_TEXTURE_2D,textureId);
        glTranslatef(static_cast<GLfloat>(x),static_cast<GLfloat>(y),0.0f);
        glListBase(base);
        glCallLists(static_cast<GLsizei>(text.length()),GL_UNSIGNED_BYTE,text.c_str());
        glDisable(GL_TEXTURE_2D);
    }
    
    const std::string BitmapFont::getFontName() const
    {
        return "Bitmap";
    }
    
    std::size_t BitmapFont::getSize() const
    {
        return 10;
    }
    
    ui::util::Dimension BitmapFont::getStringBoundingBox(const std::string &text) const
    {
        int width = static_cast<int>(text.length() * getSize());
        return ui::util::Dimension(width,static_cast<int>(getSize()));
    }

The `BitmapFontFactory` class definition inherits the `AbstractFontFactory` interface, implements the `createFont` method and stores a pointer to a `BitmapFont` instance. We include a constructor and destructor to allocate and deallocate the `BitmapFont` instance.

    class BitmapFontFactory : public ui::AbstractFontFactory
    {
    public:
        ui::Font * createFont(const std::string &font, std::size_t size);
        BitmapFontFactory();
        ~BitmapFontFactory();
    private:
        BitmapFont *bitmapFont;
    };

The implementation of `BitmapFontFactory` is straightforwarded. The constructor creates an instance of `BitmapFont` and the destructor deletes it. The `createFont` method returns the same instance of `BitmapFont` regardless of what the library requests, so that the user interface always uses the same font.

    ui::Font * BitmapFontFactory::createFont(const std::string &font, std::size_t size)
    {
        return bitmapFont;
    }
    
    BitmapFontFactory::BitmapFontFactory()
    {
        bitmapFont = new BitmapFont();
    }
    
    BitmapFontFactory::~BitmapFontFactory()
    {
        delete bitmapFont;
    }

This concludes the implementation of our bitmap font engine. The last thing we need to is tell our Gui instance that it should use our `BitmapFontFactory` , by calling the `setFontFactory` method and giving an instance of your `BitmapFontFactory` to it. If you followed the [“Getting Started” article](gettingstarted.html) you can call the `setFontFactory` method on `guiInstance` before rendering your user interface.

    guiInstance->setFontFactory(bitmapFontFactory);

We're all set and done now; the library should properly render your bitmap font. Using these two interfaces you can create more advanced font engines, such as the one in the UITest demo application, which uses [Freetype](http://www.freetype.org/) to create fonts.
