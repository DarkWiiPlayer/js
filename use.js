const apply = (func, node) => {
	if (typeof func == "function") {
		func(node)
	} else if ("then" in func) {
		func.then(result => apply(result, node))
	} else if ("default" in func) {
		func.default(node)
	}
}

export const use = node => {
	const code = Function("return (" + node.getAttribute("use") + ")")
	const func = code()
	apply(func, node)
}

export const observe = (root = document) => {
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.hasAttribute("use")) {
					use(node)
				}
			})
		})
	})
	observer.observe(root, {subtree: true, childList: true})
	return observer
}

export const run = (root = document) => {
	root.querySelectorAll("[use]").forEach(use)
}

export const install = () => {
	observe(document)
	run(document)
}
export default install
