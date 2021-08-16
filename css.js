const diversify = (prefix, now, ...rest) =>
	now
		? now.split(/, */g).map(current => diversify(prefix+' '+current, ...rest)).join(",")
		: prefix

const keyToPropName = key => key.replace(/^[A-Z]/, a => "-"+a).replace(/[A-Z]/g, a => '-'+a.toLowerCase())

const walkStyles = (styles, trail=[], buffer=[]) => {
	let inner
	const position = buffer.push(undefined)-1
	Object.entries(styles).forEach(([name, children]) => {
		if (children.constructor.name === "Object") {
			trail.push(name)
			walkStyles(children, trail, buffer)
			trail.pop()
		} else {
			inner ||= []
			const rules = Array.isArray(children)
				? children.map(e => Array.isArray(e) ? e.map(e => e.toString()).join(' ') : e.toString()).join(", ")
				: children.toString()
			inner.push(`${keyToPropName(name)}: ${children}`)
		}
	})
	if (inner) buffer[position] = (`${diversify("", ...trail)} {${inner.join("; ")}}`)
	return buffer
}

export const css = (styles) => walkStyles(styles).filter(e=>e).join("\n")

export const style = styles => {
	const style = document.createElement("style")
	style.innerHTML = css(styles)
	return style
}
