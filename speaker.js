export class Speaker {
	_callbacks = new Set()
	_scheduled = []
	_retain

	constructor(...initial) {
		this._retain = initial
	}

	listen(callback) {
		this._callbacks.add(callback)
		return this._retain
	}

	speak(...args) {
		if (!this._scheduled.length) {
			queueMicrotask(() => {
				for (const args of this._scheduled) {
					for (const callback of this._callbacks) {
						callback(...args)
					}
					this._retain = args
				}
				this._scheduled = []
			})
		}
		this._scheduled.push(args)
	}

	forget(callback) {
		this._callbacks.delete(callback)
	}

	silence() {
		this._callbacks.clear()
	}
}

export class ImmediateSpeaker extends Speaker {
	speak(...args) {
		for (const callback of this._callbacks) {
			callback(...args)
		}
		this._retain = args
	}
}

export default Speaker
