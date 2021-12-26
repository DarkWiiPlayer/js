# Listener

A generator for proxy objects that run callbacks when properties are changed.

## Interface

```js
listener(target={})
// Creates a new proxy for target
listener.listen(prop, callback)
// Adds a callback on a property change
listener.listen([prop, ...], callback)
// Adds a callback to several properties at once
listener.listen(prop)
// Removes all callbacks from a given property
```

```js
text(listener, "property")
// Returns a text node bound to listener.property
text(listener)
// Returns a text node proxy for the listener
text(listener).property
// Same as first example
```

When called with two arguments, this function returns a new text node that will
automatically update to reflect the given property on the listener.

When called with only the listener, it creates a proxy object that, when
indexed, returns the result of calling `text` on the listener and the indexed
property name.

Note that repeatedly indexing the proxy will return a new text node each time.

## Example

```js
import Listener from 'listener.js'
const listener = Listener({})

// Listen for any changed property
listener.listen("*", (value, prop) => console.log(`${prop} changed to ${value}`))

// Listen only for changes to the foo property
listener.listen("foo", prop => console.log("it was foo, by the way"))

// Several listeners for one property are possible
// They will be executed in order of definition
listener.listen("foo", prop => do_something())

listener.foo = "New Value"
// Triggers 3 handlers

listener.bar = "New Value"
// Triggers only the * handler
```
