export class BetterHTMLElement extends HTMLElement {
	attributeChangedCallback(name, old, value) { this[name+"Changed"](value, old) }

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

	// Fancier way to register an element
	// TODO: Unregister old names first
	// TODO: Register name internally
	static set tagName(name) { customElements.define(name, this) }

	// Adds property/attribute mappings to the object.
	static addProps(fields = this.observedAttributes) {
		fields.forEach( attr => Object.defineProperty(this.prototype, attr, {
			get() { return this.getAttribute(attr) },
			set(val) { this.setAttribute(attr, val) }
		}))
	}
}

/* Example:
	class FooBar extends BetterHTMLElement {
		static get observedAttributes() { return [ "name" ] }

		constructor() {
			super();
			this.attachShadow({mode: "open"});
			this.shadowRoot.innerHTML = `<h1>Hello, <span id="name"></span></h1>`
		}
		nameChanged(name) { this.shadowRoot.querySelector("#name").innerHTML=name; }
	}
	FooBar.addProps()
	FooBar.tagName = "foo-bar"
*/
