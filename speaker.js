class Speaker {
	#callbacks = new Set()
	#immediate
	#scheduled = []
	#retain

	constructor(immediate, ...initial) {
		this.#immediate = immediate
		this.#retain = initial
	}

	listen(callback) {
		this.#callbacks.add(callback)
		return this.#retain
	}

	speak(...args) {
		if (this.#immediate) {
			for (let callback of this.#callbacks) {
				callback(...args)
			}
			this.#retain = args
		} else {
			if (!this.#scheduled.length) {
				queueMicrotask(() => {
					for (let args of this.#scheduled) {
						for (let callback of this.#callbacks) {
							callback(...args)
						}
						this.#retain = args
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
