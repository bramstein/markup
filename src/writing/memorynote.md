# Memory ownership in the GUI library

The memory ownership policy for the GUI library is simple. Every block of memory allocated on the free store by the user should be deallocated by that user. This means that the library does not manage user allocated objects. While this policy is quite simple, it does have some implications on the interface and use of the library.

There are—in my opinion—two viable options for implementing memory management in a library. These two options are:

* The library does not free any memory it hasn't allocated.
* The library takes ownership of the objects it has been given, and is thus responsible for deleting them when they are no longer required.

Both rules have a lot of different implications, both negative and positive. The reason why the first policy was chosen and not the alternative is explained in the next section, where I try to explain the advantages and disadvantages of both methods.

## The library does not free any memory it hasn't allocated

Some pseudo-code that shows this option in detail:

    class Child
    {
    };

    class Parent
    {
    public:
        ~Parent();
        void addChild(Child* child);
    private:
        std::vector<Child*> childList;
    };

    ...

    void Parent::addChild(Child *child)
    {
        childList.push_back(child);
    }

    Parent::~Parent()
    {
        childList.clear();
    }

You can see that the implementation is very easy, no special care has to be taken to delete objects in the `Parent` destructor. An advantage of this method is that it reliefs the library of ownership issues and clearly makes the user responsible for ownership. Another advantage is that the user can write his or her own memory managent. For this to work, the library has to make sure that internally allocated objects use these special allocators, or only allocate memory on the stack.

The largest part of the GUI library does not allocate objects on the free store, but on the stack. The only violation to this is the default theme, which does use the free store, because it requires polymorphism to work correctly. Future releases might have this fixed.

A disadvantage with this method is that the library has to make sure the objects are really there, because the user---who owns them---can freely delete them, even while the library is still using them. Another disadvantage is ease of use. For example, it is not possible to quickly add an object and forget about it (like you can in garbage collected languages.) The following code will result in a memory leak.

    addChild(new Child());

While this construction can be useful at times, normal objects usually need to be accessed after creation, which is impossible with this construction. Another disadvantage is in using smart pointers. Using smart pointers with a framework that accepts only raw pointers is a bit tricky (unless your smart pointer has an implicit conversion to its raw pointer type, which is a dangerous thing). Given a function that takes only raw pointers and using the STL smart pointer, you'll have to write code like this:

    std::auto_ptr<Child> child(new Child());
    addChild(child.get()); // get() returns a raw pointer

Although this works, it kind of ruins the intended goal of smart pointers. While the library's methods could be modified to accept smart pointers, we cannot store STL smart pointers in STL containers, so we would gain nothing. Instead we could use [Boost](http://www.boost.org)'s smart pointers which can be used in STL containers.

## The library takes ownership

Some code that shows this option in detail is shown below. The only difference is in the `Parent` destructor, but it's not hard to imagine the changes to other functions in `Parent` . For example, a function to delete a specific `Child` from the `childList` , requires a search through all components. Then, if the specific child is found, it needs to be deallocated by `delete` .

    class Child
    {
    };

    class Parent
    {
    public:
        ~Parent();
        void addChild(Child* child);
    private:
        std::vector<Child*> childList;
    };

    ...

    void Parent::addChild(Child *child)
    {
        childList.push_back(child);
    }

    Parent::~Parent()
    {
        std::vector<Child*>::iterator iter;
        for(iter = childList.begin(); iter != childList.end(); ++iter)
        {
            delete (*iter);
        }
        childList.clear();
    }

Many of the disadvantages of the first option are the advantages of this option; objects can be added and forgotten about, smart pointers can be used more easily (except `std::auto_ptr` with its destructive copy semantics) inside the library to take ownership of the objects. Because the library owns all the objects, the user cannot delete or modify objects that the library depends on (at least, not without some very evil code.)

While this method looks superior, it suffers from one major flaw; it is not immediately clear who has ownership of objects, and the library would have to be carefully designed, programmed and documented to make this clear to the end user. It is also harder to implement custom memory management and the library would have to support this in a less transparent way.
