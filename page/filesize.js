import {text, html} from '../skooma.js'
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

	update() {
		if (this.file) {
			fetch(this.file)
				.then(response=>response.arrayBuffer())
				.then(buffer => buffer.byteLength)
				.then(length => {
					this.shadowRoot.replaceChildren(text`(${length} Bytes unminified)`)
				})
		}
	}
})
