const diversify = (prefix, now, ...rest) =>
	now
		? now.split(/, */g)
			.map(current => current.replace(/\$/g, '.'))
			.map(current => current[0] == "_"
				? diversify(prefix+current.slice(1), ...rest)
				: diversify(prefix+' '+current, ...rest)
			).join(",")
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
			inner.push(`${keyToPropName(name)}: ${rules}`)
		}
	})
	if (inner) buffer[position] = (`${diversify("", ...trail)} {${inner.join("; ")}}`)
	return buffer
}

export const css = (styles) => walkStyles(styles).filter(e=>e).join("\n")

const mkVar = name => {
	const v = (def) => `var(--${name}, ${def})`
	v.toString = () => `var(--${name})`
	return v
}

export const variable = new Proxy(Window, {
	get: (target, name, receiver) => mkVar(keyToPropName(name)),
	apply: (target, object, [name, value]) => value
		? `var(--${name})`
		: `var(--${name}, value)`
})
