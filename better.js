/*
An improved version of the default HTMLElement that provides a bunch of nice
things, most significantly:
- Automatically registering the custom element type
- Built-in event-emitting mutation observer to more easily listen to changes
- Split attribute-changed callbacks that automatically register attributes

Example:
	class FooBar extends Better {
		constructor() {
			super();
			this.attachShadow({mode: "open"});
			this.shadowRoot.innerHTML = `<h1>Hello, <span part="name"></span>!</h1>`
			this.userName = "World";
		}

		userNameChanged(name) { this.shadowRoot.querySelector('[part="name"]').innerHTML = this.userName; }
	}
	FooBar.initialise()
*/

export class Better extends HTMLElement {
	#observer
	constructor() {
		super()
		let object = this
		this.#observer = new MutationObserver((list, observer) => {
			list.forEach(m => {
				m.target.dispatchEvent(new CustomEvent("mutation", {bubbles: true, detail: m, cancelable: true}))
			})
		})
	}
	observe(options) {
		if (this.#observer) this.#observer.observe(this, options)
	}

	attributeChangedCallback(attr, old, value) {
		let name = attr.replace(/-([a-z])/, (_, l) => l.toUpperCase())
		if (name+"Changed" in this) this[name+"Changed"](value, old)
	}

	// Array of connected callbacks
	#connected = [];

	// connectedCallback but as a promise.
	// Resolves instantly when already connected and can be used more than once.
	get connected() {
		if (this.isConnected) return Promise.resolve(this)
		else return new Promise( (yes, no) => this.#connected.push({yes, no}) )
	}

	// Resolves all `connected promises
	connectedCallback() {
		if ("onConnect" in this) this.onConnect()
		this.#connected.forEach( e => e.yes(this) )
		this.#connected = []
	}

	// Array of disconnected callbacks
	#disconnected = [];

	// disconnectedCallback but as a promise.
	// Resolves instantly when already disconnected and can be used more than once.
	get disconnected() {
		if (this.isDisconnected) return Promise.resolve(this)
		else return new Promise( (yes, no) => this.#disconnected.push({yes, no}) )
	}

	// Resolves all `disconnected promises
	disconnectedCallback() {
		if ("onDisconnect" in this) this.onDisonnect()
		this.#disconnected.forEach( e => e.yes(this) )
		this.#disconnected = []
	}

	setContent(...content) {
		this.innerHTML = ""
		content.forEach( element => this.appendChild(element) )
	}
	set content(content) {
		this.setContent(content)
	}

	// Adds property/attribute mappings to the object.
	static initialise(name = this.name) {
		const names = Object
			.getOwnPropertyNames(this.prototype)
			.filter(name => name.search(/Changed$/)+1)
			.map(name => name.replace(/Changed$/, ''))
			.concat(this.properties ?? [])
		const attributes = names.map(attr => attr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase())
		Object.defineProperty(this, "observedAttributes", {
			get() { return attributes }
		})
		names.forEach(name => {
			let attr = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
			Object.defineProperty(this.prototype, name, {
				get() { return this.getAttribute(attr) },
				set(val) { this.setAttribute(attr, val) }
			})
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
