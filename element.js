export default Class => {
	const proto = Class.prototype

	const attributes = Class.attributes || {}

	const props = []

	Object.entries(attributes).forEach(([name, attribute]) => {
		const htmlName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
		props.push(htmlName)
		const prop = {}

		prop.get = typeof attribute.get == "function"
			? function() { return attribute.get.call(this, this.getAttribute(htmlName)) }
			: function() { return this.getAttribute(htmlName) }

		prop.set = typeof attribute.set == "function"
			? function(val) { return this.setAttribute(htmlName, attribute.set.call(this, val)) }
			: attribute.set === false
			? function() { throw(Error(`Attribute ${name} cannot be set`)) }
			: function(val) { this.setAttribute(htmlName, val) }

		Object.defineProperty(proto, name, prop)
	})
	Object.freeze(props)

	Object.defineProperty(Class.prototype, "props", { get() { return Object.fromEntries(props.map(prop => [prop, this[prop]])) } })

	const observedAttributes = Object.freeze([...Object.keys(attributes)])

	Object.defineProperty(Class, "observedAttributes", {
		get() { return observedAttributes }
	})

	Class.prototype.attributeChangedCallback = function(name, oldValue, newValue) {
		name = name.replaceAll(/-(.)/g, (_, b) => b.toUpperCase())
		const get_transform = attributes[name]?.get
		if (`${name}Changed` in this) {
			if (typeof get_transform == "function")
				return this[`${name}Changed`](get_transform(oldValue), get_transform(newValue))
			else
				return this[`${name}Changed`](oldValue, newValue)
		}
		if (`changed` in this) {
			if (typeof get_transform == "function")
				return this.changed(name, get_transform(oldValue), get_transform(newValue))
			else
				return this.changed(name, oldValue, newValue)
		}
	}

	/* Enable batch-processing for dollar-methods */
	/* This would be much nicer if decorators were a thing */
	for (const name of Object.getOwnPropertyNames(Class.prototype)) {
		if (name.startsWith("$")) {
			const prop = Object.getOwnPropertyDescriptor(Class.prototype, name)
			if (typeof prop.value == "function") {
				Class.queues = new WeakMap()
				Class.prototype[name.slice(1)] = function(...args) {
					const queue = Class.queues.has(this) ? Class.queues.get(this) : []
					if (!queue.length) queueMicrotask(() => {
						this[name](...queue)
						queue.length = 0
					})
					queue.push(args)
					Class.queues.set(this, queue)
				}
			}
		}
	}

	proto.insert = function(...args) {
		return (this.shadowRoot || this).append(...args)
	}
	proto.replace = function(...args) {
		return (this.shadowRoot || this).replaceChildren(...args)
	}

	Object.prototype[Symbol.toPrimitive] = function(hint) {
		const name = `to${hint.replace(/./, e => e.toUpperCase())}`
		return name in this
			? this[name]()
			: "toDefault" in this
			? this.toDefault()
			: `[object ${Class.name}]`
	}

	name = Class.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
	customElements.define(name, Class, {extends: Class.is})
}
