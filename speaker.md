# Speaker

A simple messaging helper that lets you publish and subscribe to messages.
Callbacks are scheduled as microtasks by default.

## Interface:

```
Speaker(immediate=false)
// Creates a new speaker.
Speaker.listen(callback)
// Registers a callback.
Speaker.speak(...args)
// Runs all callbacks with given arguments
Speaker.silence(callback)
// Removes a given callback
```
