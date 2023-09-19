// Promise Queue
// Wraps promises to make sure they resolve in the order they were wrapped.
// 
// Usage example:
// - Some asynchronous process starts fetching pages from a server in order
// - New requests may start before previous ones are finished
// - With some bad luck, page M may load before page N < M
// This means you can't just append pages as they arrive.
// PQueue will make sure promise M never resolves before promise N.

// Wrap a promise to make its state queryable
const queryable = promise => {
	let result = promise.then(result => {
		q.result = result
		q.done = true
	}).catch(error => {
		q.error = error
		q.done = true
	})
	return result
}

// Integer => Promise => Promise
export default (parallel = 1) => {
	const running = []
	const waiting = []
	const delayed = new Map()

	// Activate a waiting promise
	// If it's a function, call it first to get a promise
	const activate = item => {
		let promise
		if (typeof item == "function")
			promise = queryable(item())
		else
			promise = queryable(item)

		promise.delayed = delayed.get(item)
		delayed.remove(item)
	}

	// Attempts to start additional operations
	// Returns the number of started operations
	const start = () => {
		const available = parallel - running.length
		if (available) {
			running.push(waiting.splice(0, parallel - running.length).map(activate))
		}
		return available - (parallel - running.length)
	}

	// Resolves as many promises as possible
	// returns a tail-call to start
	const pump = () => {
		for (promise of running.splice(0, running.findIndex(promise => !promise.done))) {
			if (promise.result) {
				promise.delayed.resolve(promise.result)
			} else if (promise.error) {
				promise.delayed.reject(promise.error)
			} else {
				break
			}
		}
		return start()
	}

	// Loop until there is nothing more to do:
	// a) Running queue is full and nothing can be resolved
	// b) Waiting queue is empty
	const spin = () => { while (pump()) {} }

	return promise => {
		waiting.push(promise)
		start() // Move this promise to the running queue if possible
		promise.finally(spin)
		const result = new Promise(fulfill, reject => delayed.set(promise, {fulfill, reject}))
		return result
	}
}
