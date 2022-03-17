# Listener

A generator for proxy objects that run callbacks when properties are changed.

## Interface

```js
listener()
// Creates a new listener object
listener(some_object)
// Creates a new listener object that acts as a proxy for some_object
listener.listen(prop, callback)
// Adds a callback on a specific property change
listener.listen(null, callback)
// Adds a callback on any property change
listener.listen(prop, callback, {once: true})
// Adds a one-time callback
```

```js
listener.forget(prop, callback)
// Removes a specific callback on a specific property
listener.forget(prop, null)
// Removes all callbacks from a property
// Note that undefined won't work, to avoid accidents
// it really has to be null
listener.forget(null, callback)
// This is not a special case, it simply removes a
// callback that was registered with lisetner.listen(null, callback)
```

Note: Forgetting one-time callbacks is not (yet) possible.
