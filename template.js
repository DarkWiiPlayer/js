/*
A simple function to more easily write HTML in Javascript

Example:
	const greeting = name => template`<p>Hello, ${name}!</p><br>`
	document.append(greeting(bob).cloneNode(true))
*/

export const template = (strings, ...args) => {
	let buf = []
	for (let i=0;i<strings.length;i++) {
		buf.push(strings[i], args[i])
	}
	let template = document.createElement("template")
	template.innerHTML = buf.join("")
	return template.content
}
