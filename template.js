export const template = (strings, ...args) => {
	let buf = []
	for (i=0;i<strings.length;i++) {
		buf.push(strings[i], args[i])
	}
	let template = document.createElement("template")
	template.innerHTML = buf.join("")
	return template.content
}
