import {text, html} from '../skooma.js'
import {Better} from '../better.js'

class FileSize extends Better {
	static attributes = {file: true}

	constructor() {
		super()
		this.attachShadow({mode: "open"})
		this.connected.then(self => self.update())
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
}

FileSize.initialise()
