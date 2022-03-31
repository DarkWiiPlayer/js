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

export default () => {
	const queue = []
	const delayed = new Map()

	loop = () => {
		for (promise of queue.splice(0, queue.findIndex(promise => !promise.done))) {
			if (promise.result) {
				delayed.get(promise).resolve(promise.result)
			} else if (promise.error) {
				delayed.get(promise).reject(promise.error)
			} else {
				break
			}
		}
	}

	return promise => {
		promise = queryable(promise)
		queue.push(promise)
		promise.finally(loop)
		const result = new Promise(fulfill, reject => delayed.set(promise, {fulfill, reject}))
		return result
	}
}
