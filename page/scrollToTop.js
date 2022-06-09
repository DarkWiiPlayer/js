import element from "../element.js"
import {css, variable as v} from "../css.js"

element(class ScrollToTop extends HTMLElement {
	constructor() {
		super()
		this.append(
			html.a("↑")
		)
		this.addEventListener("click", event => {
			document.body.scrollTo({top: 0, behavior: "smooth"})
		})
	}
})

let radius = .6

const setTop = () => {
	if (document.body.scrollTop > 20) {
		document.body.classList.remove("top")
	} else {
		document.body.classList.add("top")
	}
}

window.addEventListener("scroll", setTop, {passive: true})
setTop()

document.head.append(html.style(css({
	"scroll-to-top": {
		background: v`color-hl`,
		color: 'white',
		width: CSS.em(radius*2),
		height: CSS.em(radius*2),
		borderRadius: CSS.em(radius),
		display: 'flex',
		justifyContent: "center",
		alignItems: "center",
		fontSize: CSS.em(3),
		boxShadow: [
			[...[.1, .1, .2].map(CSS.em), "#0004"],
		],
		position: 'fixed',
		right: CSS.em(radius * 2),
		bottom: CSS.em(radius * 2),
		transition: [
			["all", CSS.s(.3)],
		],
		cursor: "pointer",
	},
	'.top': {
		"scroll-to-top": {
			opacity: 0,
			transform: `translate(0px, ${CSS.em(radius * 2)})`,
		}
	}
})))
