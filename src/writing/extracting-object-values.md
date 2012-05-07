## Extracting values from JavaScript objects

The [JUnify unification library](../projects/junify/) allows you to extract values from JavaScript objects, for example JSON data structures. The variable syntax is however a bit cumbersome when all you want is to extract properties from objects, because it requires you to repeat the property name twice (e.g. `{title: $('title')}`.) The syntax would be simpler if we could just indicate that we'd like a property extracted, for example `{title: _}`. We will use the `visit_pattern` method from the JUnify library to implement a simple object extraction module.

We start by creating a new module called `extract`. In this module we define some short-hand variables to methods in the unification library. We create a new visitor object and implement the `object` callback function. When the object value equals the wildcard `_` pattern we return a new variable with the key as name. If the value is not a wildcard we return it unmodified.

    extract = function () {
        var unify         = unification.unify,
            variable      = unification.variable,
            visit_pattern = unification.visit_pattern,
            _             = unification._;

        var visitor = {
            'object' : function(key, value) {
                if (value === _) {
                    return variable(key);
                }
                else {
                    return value;
                }
            }
        };

        return function (pattern, value) {
            return unify(visit_pattern(pattern, visitor), value);
        };
    }();

An example of its use:

    var json = {text: "Hello", name: "World!"};
    
    // l.text = "Hello", l.name = "World!"
    var l = extract({text: _, name: _}, json);
    
    // r.name = "World!"
    var r = extract({_:_, name: _}, json);

Note that the simplified extract syntax only works on objects; array values will require the use of the `variable` method. Also, if your data contains the same property names twice, only the value of the last occurance will be returned. In this case it is better to use the normal variable syntax.

## Extracting typed values

The JUnify unification library also supports matching typed values and we can also support this in our simplified syntax. The syntax we will use is: `{myname: MyType}` which returns a `myname` binding if it is matched against another object with property name `myname` and of type `MyType`. In JavaScript objects are typed according to their constructors and constructors are functions. So to create typed variable we need to test if the value is a function and if it is, return a new typed variable. Modify the visitor in the following way:

        var visitor = {
            'object' : function(key, value) {
                if (value === _) {
                    return variable(key);
                }
                else if (typeof value === 'function') {
                    return variable(key, value);
                }
                else {
                    return value;
                }
            }
        };

That's all we need to do to add support for extracting typed objects. An example:

    var o = {date: new Date()};
    
    // r.date = "Sat Jul 05 2008 …"
    var r = extract({date: Date}, o);

This concludes the implementation of an object property extractor using the JUnify library. You can download the code [extract.js](extract.js) for your convenience.
