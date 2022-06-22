import element from '../element.js'
import {html} from '../skooma.js'

element(class TableOfContents extends HTMLElement {
	connectedCallback() {
		this.generate()
	}

	generate() {
		const entries = Array.from(document.querySelectorAll("h2[id]"))
			.map(heading => html.li(
				html.a(
					heading.innerText,
					{
						href: `#${heading.id}`,
						class: ["fancy"]
					})
				)
			)
		this.replaceChildren(html.ul(entries))
	}
})
