export class ChangeEvent extends Event {
	constructor(...changes) {
		super('change')
		this.changes = changes
	}
}

export class MapStorage extends Storage {
	#map = new Map()
	key(index) {
		return [...this.#map.keys()][index]
	}
	getItem(keyName) {
		if (this.#map.has(keyName))
			return this.#map.get(keyName)
		else
			return null
	}
	setItem(keyName, keyValue) {
		this.#map.set(keyName, String(keyValue))
	}
	removeItem(keyName) {
		this.#map.delete(keyName)
	}
	clear() {
		this.#map.clear()
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
			set: (_target, prop, value) => {
				this.emit(prop, value)
				this.set(prop, value)
				return true
			},
			get: (_target, prop) => this.get(prop),
		})

		this.addEventListener

		// Try running a "<name>Changed" method for every changed property
		// Can be disabled to maybe squeeze out some performance
		if (options.methods ?? true) {
			this.addEventListener("change", ({changes}) => {
				new Map(changes).forEach((value, prop) => {
					if (`${prop}Changed` in this) this[`${prop}Changed`](value)
				})
			})
		}
	}

	// When you only need one value, you can skip the proxy.
	set value(value) { this.proxy.value = value }
	get value() { return this.proxy.value }

	// Anounces that a prop has changed
	emit(prop, value) {
		if (this.#options.defer ?? true) {
			if (!this.#queue) {
				this.#queue = []
				queueMicrotask(() => {
					this.dispatchEvent(new ChangeEvent(...this.#queue))
					this.#queue = undefined
				})
			}
			this.#queue.push([prop, value])
		} else {
			this.dispatchEvent(new ChangeEvent([prop, value]))
		}
	}

	set(prop, value) {
		this.#target[prop] = value
	}

	get(prop) {
		return this.#target[prop]
	}
}

export class StoredState extends State {
	#storage
	#valueKey

	constructor(init, options={}) {
		super({}, options)
		this.#storage = options.storage ?? localStorage ?? new MapStorage()
		this.#valueKey = options.key ?? 'value'

		// Initialise storage from defaults
		for (const [key, value] of Object.entries(init)) {
			if (this.#storage[key] == undefined)
				this.set(key, value)
		}

		// Emit change events for any changed keys
		for (let i=0; i<this.#storage.length; i++) {
			const key = this.#storage.key(i)
			const value = this.#storage[key]
			if (value !== JSON.stringify(init[key]))
				this.emit(key, value)
		}

		// Listen for changes from other windows
		addEventListener("storage", event => {
			let prop = event.key
			if (prop === this.#valueKey) prop = 'value'
			this.emit(prop, JSON.parse(event.newValue))
		})
	}

	set(prop, value) {
		if (prop == "value") prop = this.#valueKey
		this.#storage[prop] = JSON.stringify(value)
	}

	get(prop) {
		if (prop == "value") prop = this.#valueKey
		return JSON.parse(this.#storage[prop])
	}
}

export default State
