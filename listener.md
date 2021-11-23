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
bind(listener, "value")
// Returns a text node with listener.value as its content
// that will change whenever the value is changed
bind(listener, "value", html_element)
// Binds an existng HTML or Text node
bind(listener, "value", html_element, value => value.toUpperCase())
// Filters the value through a function before setting it
```

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
