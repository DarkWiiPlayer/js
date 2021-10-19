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

## Example

A simple example:

```js
const speaker = new Speaker(true /* run callbacks immediately */)

speaker.listen(value => console.log(value))
speaker.listen(value => console.warn(value))

speaker.speak("This will be logged twice")

console.log("This message will appear last")
```

A slightly more convoluted example:

```js
import Speaker from '/speaker.js'

// A new message that schedules messages as microtasks
const speaker = new Speaker()

// A callback that calls messages as functions
speaker.listen(fn => fn())

// A shorthand wrapper around the speaker
const defer = fn => speaker.speak(fn)

// Defer a function to be called in a microtask
defer(() => console.log("This message will appear second"))

console.log("This message will appear first")

// Defer another function to be called in a microtask
defer(() => console.log("This message will appear third"))
// Note: A single speaker will use a single microtask even
// for multiple messages.

defer(() => {
	// You can continue pushing messages inside the callback;
	// they will be processed within the same microtask.
	defer(() => console.log("This message will appear last"))
})
```
