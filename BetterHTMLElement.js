export class BetterHTMLElement extends HTMLElement {
	attributeChangedCallback(name, old, value) { if (name+"Changed" in this) this[name+"Changed"](value, old) }

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

	// Fancier way to register an element
	// TODO: Unregister old names first
	// TODO: Register name internally
	static set tagName(name) { customElements.define(name, this) }

	// Adds property/attribute mappings to the object.
	static initialize(name = this.name) {
		const names = Object
			.getOwnPropertyNames(this.prototype)
			.filter(name => name.search(/Changed$/)+1)
			.map(name => name.replace(/Changed$/, ''))
		Object.defineProperty(this, "observedAttributes", {
			get() { return names }
		})
		names.forEach( attr => Object.defineProperty(this.prototype, attr, {
			get() { return this.getAttribute(attr) },
			set(val) { this.setAttribute(attr, val) }
		}))
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
			this.shadowRoot.innerHTML = `<h1>Hello, <span id="name"></span></h1>`
		}

		nameChanged(name) { this.shadowRoot.querySelector("#name").innerHTML=name; }
	}
	FooBar.initialize()
*/
