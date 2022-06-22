import {text, html, fragment} from '../skooma.js'
import element from "../element.js"

element(class FileSize extends HTMLElement {
	static attributes = {file: true}

	constructor() {
		super()
		this.attachShadow({mode: "open"})
	}

	connectedCallback() {
		this.update()
	}

	fileChanged() {
		this.update()
	}

	cloneChildren(deep=true) {
		return Array.from(this.childNodes).map(node => node.cloneNode(deep))
	}

	update() {
		if (this.file) {
			fetch(this.file)
				.then(response=>response.arrayBuffer())
				.then(buffer => buffer.byteLength)
				.then(length => {
					this.shadowRoot.replaceChildren(text`${fragment(...this.cloneChildren())} (${length} Bytes unminified)`)
				})
		}
	}
})
