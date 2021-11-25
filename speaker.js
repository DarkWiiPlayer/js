class Speaker {
	#callbacks = new Set()
	#immediate
	#scheduled = []
	#current

	constructor(immediate, current=[]) {
		this.#immediate = immediate
		this.#current = current
	}

	listen(callback) {
		this.#callbacks.add(callback)
		return this.#current
	}

	speak(...args) {
		this.#current = args
		if (this.#immediate) {
			for (let callback of this.#callbacks) {
				callback(...args)
			}
		} else {
			if (!this.#scheduled.length) {
				queueMicrotask(() => {
					for (let args of this.#scheduled) {
						for (let callback of this.#callbacks) {
							callback(...args)
						}
					}
					this.#scheduled = []
				})
			}
			this.#scheduled.push(args)
		}
	}

	silence(callback) {
		this.#callbacks.delete(callbacks)
	}
}

export default Speaker
