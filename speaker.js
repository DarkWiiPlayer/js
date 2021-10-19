class Speaker {
	#callbacks = new Set()
	#immediate
	#scheduled = []

	constructor(immediate) {
		this.#immediate = immediate
	}

	listen(callback) {
		this.#callbacks.add(callback)
	}

	speak(...args) {
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
