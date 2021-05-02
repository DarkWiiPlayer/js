export class BetterHTMLElement extends HTMLElement {
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
		this.#connected.forEach( e => e.yes(this) );
		this.#connected = [];
	}

	setContent(...content) {
		this.innerHTML = ""
		content.forEach( element => this.appendChild(element) )
	}
	set content(content) {
		this.setContent(content)
	}

	// Adds property/attribute mappings to the object.
	static initialize(name = this.name) {
		const names = Object
			.getOwnPropertyNames(this.prototype)
			.filter(name => name.search(/Changed$/)+1)
			.map(name => name.replace(/Changed$/, ''))
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
		customElements.define(name, this)
		return name
	}
}

/* Example:
	class FooBar extends BetterHTMLElement {
		constructor() {
			super();
			this.attachShadow({mode: "open"});
			this.shadowRoot.innerHTML = `<h1>Hello, <span part="name"></span>!</h1>`
			this.userName = "World";
		}

		userNameChanged(name) { this.shadowRoot.querySelector('[part="name"]').innerHTML = this.userName; }
	}
	FooBar.initialize()
*/
