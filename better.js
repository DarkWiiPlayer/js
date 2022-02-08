export default class extends HTMLElement {
	constructor() {
		super()
		if (this.constructor.shadow) this.attachShadow({mode: 'open'})
		let object = this
	}

	get root() {
		return this.shadowRoot || this
	}

	connectedCallback() {
		if ("onConnect" in this) this.onConnect()
		this.dispatchEvent(new Event("connected"))
	}

	disconnectedCallback() {
		if ("onDisconnect" in this) this.onDisonnect()
		this.dispatchEvent(new Event("disconnected"))
	}

	set content(content) {
		this.root.replaceChildren(content)
	}

	attributeChangedCallback(attr, old, value) {
		let name = attr.replace(/-([a-z])/, (_, l) => l.toUpperCase())
		let attribute = this.constructor.attributes[name]
		if (name+"Changed" in this)
			if (typeof(attribute.get) == "function")
				this[name+"Changed"](attribute.get.call(this, value), attribute.get.call(this, old))
			else
				this[name+"Changed"](value, old)
	}
	// Adds property/attribute mappings to the object.
	static initialise(name = this.name) {
		let attributes = this.attributes
			? [...Object.keys(this.attributes)]
			: []
		/* See HTMLElement API */
		Object.defineProperty(this, "observedAttributes", {
			get() { return attributes.map(attr => attr.replace(/[A-Z]/, u => "-"+u.toLowerCase())) }
		})
		attributes.forEach(name => {
			let attribute = this.attributes[name]
			let htmlName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
			let prop = {}
			/* Is there a get filter? */
			if (typeof attribute.get == "function")
				prop.get = function() { return attribute.get.call(this, this.getAttribute(htmlName)) }
			else
				prop.get = function() { return this.getAttribute(htmlName) }
			/* Is there a set filter? */
			if (typeof attribute.set == "function")
				prop.set = function(val) { return this.setAttribute(htmlName, attribute.set.call(this, val)) }
			else if (attribute.set === false)
				prop.set = function(val) { throw(`Attribute ${name} cannot be set`) }
			else
				prop.set = function(val) { this.setAttribute(htmlName, val) }

			Object.defineProperty(this.prototype, name, prop)
		})
		name = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
		if (this.extends)
			customElements.define(name, this, { extends: this.extends })
		else
			customElements.define(name, this)
		return name
	}
	static initialize(name) { this.initialise(name) }
}
