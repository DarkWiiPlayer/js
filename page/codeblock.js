import {html} from "../skooma.js"
import {css, variable} from "../css.js"
import {template} from "../template.js"

document.head.append(html.link({rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/styles/github.min.css'}))
import hljs from 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/es/highlight.min.js';
import javascript from 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/es/languages/javascript.min.js';
hljs.registerLanguage('javascript', javascript);

const escapes = { "&gt;": ">" }
class CodeBlock extends HTMLElement {
	connectedCallback() {
		let content = this.innerHTML
			.replace(/^\s*\n/, "")
			.replace(/\n\s*$/, "")
		let prefix = new RegExp(`(?<![^\n])${content.match(/^\t*/)}`, "g")
		content = content
			.replace(prefix, "")
			.replace(/&[a-z]+;/g, str => escapes[str] ?? str)
		this.replaceChildren(html.pre(html.code(template(hljs.highlight(content, {language: 'javascript'}).value))))
	}
}

customElements.define("code-block", CodeBlock)

document.head.append(html.style(css({
	'code-block': {
		code: {
			fontSize: CSS.em(1.2),
			padding: CSS.em(.6),
			borderRadius: CSS.em(.6),
			backgroundColor: "#efedff",
			boxShadow: [
				[...[.2, .2, .4].map(CSS.em), '#0000000a', 'inset'],
				[...[.2, .4, .6].map(CSS.em), '#0002'],
			],
			border: "none",
			tabSize: 3,
			display: "block",
		}
	}
})))
