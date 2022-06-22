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
			//backgroundColor: "#00000006",
			backgroundColor: "#fff4",
			borderRadius: CSS.em(.6),
			border: 'none',
			boxShadow: [
				[...[.2, .4, .6].map(CSS.em), '#0003'],
			],
			display: "block",
			fontSize: CSS.em(1.2),
			padding: [[.8, 1.2].map(CSS.em)],
			tabSize: 3,
		}
	}
})))
