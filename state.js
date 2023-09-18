export class ChangeEvent extends Event {
	constructor(...changes) {
		super('change')
		this.changes = changes
	}
}

export class State extends EventTarget {
	#target
	#options
	#queue
	constructor(target={}, options={}) {
		super()
		this.#options = options
		this.#target = target
		this.proxy = new Proxy(target, {
			set: (_target, prop, value) => { this.set(prop, value); return true },
			get: (target, prop) => target[prop],
		})

		this.addEventListener

		if (options.methods ?? true) {
			this.addEventListener("change", ({changes}) => {
				new Map(changes).forEach((value, prop) => {
					if (`${prop}Changed` in this) this[`${prop}Changed`](value)
				})
			})
		}
	}

	set state(value) { this.proxy.state = value }
	get state() { return this.proxy.state }

	set(prop, value) {
		if (this.#options.defer ?? true) {
			if (!this.#queue) {
				this.#queue = []
				queueMicrotask(() => {
					this.dispatchEvent(new ChangeEvent(...this.#queue))
					this.#queue = undefined
				})
			}
			this.#queue.push([prop, value])
			this.#target[prop] = value
		} else {
			this.#target[prop] = value
			this.dispatchEvent(new ChangeEvent([prop, value]))
		}
	}
}

export default State
