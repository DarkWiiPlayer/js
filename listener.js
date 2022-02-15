/*
A somewhat refined Proxy generator that lets you selectively listen to changed
properties and react accordingly.

Example:
	const l = listener()
	l.listen("contract", contract => speaker.handle(contract))
	l.contract = new Contract()
*/

const registry = new Map()

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
		get: (target, prop, value) => prop=="listen"
			? listen
			: target[prop]
	})
	registry.set(proxy, target)
	return proxy
}

listener.raw = proxy => registry.get(proxy)

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
