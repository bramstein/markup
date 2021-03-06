## Creating an OpenGL Component

Custom OpenGL rendering in your GUI can be quite handy, consider having a player model setup, or damage info on your main characters vehicle shown in full blown 3D, with the damaged parts highlighted in red.

Since the GUI is already rendered in OpenGL, it should be simple, right?

Let's sum up the things we need:

* Independent rendering of the GUI
* A proper OpenGL viewport
* A method we can use for animation
* A method for rendering
* A class of which we can overload the mentioned render and update methods

Let's start simple, and inherit our new class, `GLCanvas` from the default Component class. Next, overload the `updateComponent()` method, and add a virtual render method. We use `Component` because the OpenGL widget should not have any children. Also overload `getPreferredSize` and `paintComponent`, as we're going to do some custom painting and need to return the preferred size, since a Component with no children is laid out by the LayoutManagers with zero width and height (thus rendering it invisible).

Your code might look like this:

    class GLCanvas : public Component
    {
    public:
        GLCanvas(int width, int height);
        virtual updateComponent(float deltaTime);
        virtual void render() = 0;
        Dimension& getPreferredSize();
    private:
        void paintComponent(Graphics& g);
        Dimension size;
    };

I've also added a size variable, and a constructor which takes the height and width of the OpenGL viewport in the GLCanvas.

Let's move on to the implementation. The constructor is straightforward:

    GLCanvas::GLCanvas(int width, int height)
        : size(width,height)
    {
    }

You could also set the background color here, but I chose not to. The next two methods, `updateComponent` and `render` are not explained. `render` is a pure virtual function and does not require a function body, and `updateComponent` has an empty function body. This is done so that you must overload `render`, and have `updateComponent` as optional overload.

Here's `getPreferredSize()` Again, it just returns the size we initialized in the constructor.

    Dimension& GLCanvas::getPreferredSize()
    {
        return size;
    }

Now we're down to the last and most interesting part of this class, `paintComponent`. We'd like to paint the background, so the first thing we do is call `paintComponent`, like this:

    Component::paintComponent(g);

Next we'll need to set up a custom OpenGL viewport for our component. But first we need to save the current viewport (of the GUI itself) so we don't mess up the GUI rendering.

    glPushAttrib(GL_VIEWPORT_BIT); // save the viewport
    (...)
    glPopAttrib();// restore viewport

Since we saved the current viewport we can set up a new one without worries. One point of concern is the fact that OpenGL has its 0,0 point in the lower left corner and the GUI in the upper left corner. To fix this, we retrieve the current viewport and subtract the Components height and y position from the viewport height, resulting in the correct y position for our coordinate system. Note that we first retrieve the current x and y location and the width and height.

    Component::paintComponent(g);

    int x = getLocationOnScreen().x;
    int y = getLocationOnScreen().y;
    int width = getBounds().width;
    int height = getBounds().height;

    glPushAttrib(GL_VIEWPORT_BIT); // save the viewport

    int viewport[4];
    glGetIntegerv(GL_VIEWPORT,viewport);

    // adjust from OpenGL coordinate system to ours..
    y = viewport[3] - y - height;

    (...)

    glPopAttrib();// restore viewport

To set our new viewport we need to switch to the projection matrix, save our current matrix, reset the coordinates (replace the current matrix with the identity matrix) and set the viewport. Finally we switch back to the model view matrix.

    Component::paintComponent(g);

    int x = getLocationOnScreen().x;
    int y = getLocationOnScreen().y;
    int width = getBounds().width;
    int height = getBounds().height;

    glPushAttrib(GL_VIEWPORT_BIT);

    int viewport[4];
    glGetIntegerv(GL_VIEWPORT,viewport);

    // adjust from OpenGL coordinate system to ours..
    y = viewport[3] - y - height;

    // enter projection mode
    glMatrixMode(GL_PROJECTION);

    // save current projection matrix
    glPushMatrix();

    // reset coordinate system
    glLoadIdentity();

    // adjust viewport
    glViewport(x,y,width,height);

    // set perspective
    gluPerspective(45,1*(width/height),1,1000);

    // set to modelview mode
    glMatrixMode(GL_MODELVIEW);

    // reset coordinate system
    glLoadIdentity();

    // point 'camera'
    gluLookAt(0.0,0.0,5.0,0.0,0.0,-1.0,0.0f,1.0f,0.0f);

    // call pure render function
    render();

    // switch to projection
    glMatrixMode(GL_PROJECTION);

    // pop, restoring the old projection matrix
    glPopMatrix();

    // reset modelview matrix
    glMatrixMode(GL_MODELVIEW);

    // restore viewport
    glPopAttrib();

That should be enough for our first test run. Just to be sure, compile and run this component. Nothing exciting yet, but it should run.

Let's do something fancy with it, a spinning cube! Create a new class and inherit it from GLCanvas, and overload the render and updateComponent method. Also add a private float called rotation;

It might looks something like this:

    class RotatingCube : public ui::GLCanvas
    {
    public:
        RotatingCube();
        void render();
        void updateComponent(float deltaTime);
    private:
        float rotation;
    };

And the implementation:

    RotatingCube::RotatingCube()
        : ui::GLCanvas(200,200)
    {
        rotating = 0.0f;
    }

    void RotatingCube::render()
    {
        glRotatef(rotation,1.0f,0.5f,0.2f);

        glBegin(GL_QUADS);

        glColor3f(0.0f,1.0f,0.0f);
        glVertex3f( 1.0f, 1.0f,-1.0f);
        glVertex3f(-1.0f, 1.0f,-1.0f);
        glVertex3f(-1.0f, 1.0f, 1.0f);
        glVertex3f( 1.0f, 1.0f, 1.0f);

        glColor3f(1.0f,0.5f,0.0f);
        glVertex3f( 1.0f,-1.0f, 1.0f);
        glVertex3f(-1.0f,-1.0f, 1.0f);
        glVertex3f(-1.0f,-1.0f,-1.0f);
        glVertex3f( 1.0f,-1.0f,-1.0f);

        glColor3f(1.0f,0.0f,0.0f);
        glVertex3f( 1.0f, 1.0f, 1.0f);
        glVertex3f(-1.0f, 1.0f, 1.0f);
        glVertex3f(-1.0f,-1.0f, 1.0f);
        glVertex3f( 1.0f,-1.0f, 1.0f);

        glColor3f(1.0f,1.0f,0.0f);
        glVertex3f( 1.0f,-1.0f,-1.0f);
        glVertex3f(-1.0f,-1.0f,-1.0f);
        glVertex3f(-1.0f, 1.0f,-1.0f);
        glVertex3f( 1.0f, 1.0f,-1.0f);

        glColor3f(0.0f,0.0f,1.0f);
        glVertex3f(-1.0f, 1.0f, 1.0f);
        glVertex3f(-1.0f, 1.0f,-1.0f);
        glVertex3f(-1.0f,-1.0f,-1.0f);
        glVertex3f(-1.0f,-1.0f, 1.0f);

        glColor3f(1.0f,0.0f,1.0f);
        glVertex3f( 1.0f, 1.0f,-1.0f);
        glVertex3f( 1.0f, 1.0f, 1.0f);
        glVertex3f( 1.0f,-1.0f, 1.0f);
        glVertex3f( 1.0f,-1.0f,-1.0f);

        glEnd();
    }

    void RotatingCube::updateComponent(float deltaTime)
    {
        rotation -= 0.15f * deltaTime;
    }

Compile and run. You would expect a rotating cube. But nothing displays. The reason for this is that the rotating cube uses the OpenGL depth buffer, which is also used by the GUI to render its components. The GUI simply overlaps the custom 3d rendering. We need to clear the depth buffer at the location of the GLCanvas. So open up `GLCanvas.cpp` and add a `glClear(GL_DEPTH_BUFFER_BIT)` right before the `render` call. Again, compile and test, and yadda! There it is!

Unfortunately if you play around with it, you might notice the GUI behaves oddly. This is because we clear the entire depth buffer, which the GUI uses. After searching for a bit, I found this comment on the OpenGL site:

> The OpenGL Specification states that glClear() only clears the scissor rectangle when the scissor test is enabled.

As the GUI already has commands for scissor testing, adding it is dead simple. After retrieving the window location and size in `GLCanvas::paintComponent`, add:

    g.enableScissor(x,y,width,height);

and at the end of the function:

    g.disableScissor();

Now all should work fine and dandy. (Note that PopupMenus get drawn behind the GLCanvas, which makes it a component that should be used carefully. But if used right, it can also be very useful.)
