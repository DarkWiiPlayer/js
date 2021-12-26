/*
A somewhat refined Proxy generator that lets you selectively listen to changed
properties and react accordingly.

Example:
	const l = listener()
	l.listen("contract", contract => speaker.handle(contract))
	l.contract = new Contract()
*/

export const listener = (target={}) => {
	let callbacks = new Map()
	function listen(prop, callback) {
		if ("object" == typeof prop && "forEach" in prop) {
			prop.forEach(prop => this.listen(prop, callback))
		} else if (callback) {
			let list = callbacks.get(prop)
			if (!list) callbacks.set(prop, list=[])
			list.push(callback)
		} else {
			callbacks.delete(prop)
		}
	}
	let proxy = new Proxy(target, {
		set: (target, prop, value) => {
			if (callbacks.has("*")) callbacks.get("*").forEach(callback => callback(value, prop, target[prop]))
			if (callbacks.has(prop)) callbacks.get(prop).forEach(callback => callback(value, prop, target[prop]))
			return Reflect.set(target, prop, value)
		},
		get: (target, prop, value) => {
			if (prop == "listen")
				return listen
			else if (prop == "__raw")
				return target
			else
				return Reflect.get(target, prop)
		}
	})
	return proxy
}

export const bindContent = (listener, prop="value", target=document.createTextNode(""), filter) => {
	const run = data => {
		data = filter
			? filter(data)
			: data
		if ("innerText" in target)
			if (typeof data == "string")
				target.innerText = data
			else
				target.replaceChildren(data)
		else
			target.data = data
	}
	listener.listen(prop, run)
	run(listener[prop])
	return target
}

export const text = (listener, prop) => {
	if (prop) {
		const node = document.createTextNode(listener[prop])
		listener.listen(prop, data => node.data = data)
		return node
	} else {
		return new Proxy(listener, {
			get: (target, prop, receiver) => text(listener, prop)
		})
	}
}

export default listener
