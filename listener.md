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
