function setup(root) {
	root.parts = {}
	root.querySelectorAll("[part-id]").forEach( element => {
		root.parts[element.getAttribute("part-id")] = element
	})
	root.clone = function() { return setup(this.cloneNode(true)) }
	return root
}

function template(strings, ...args) {
	let buf = []
	for (i=0;i<strings.length;i++) {
		buf.push(strings[i], args[i])
	}
	let template = document.createElement("template")
	template.innerHTML = buf.join("")
	return setup(template.content)
}
