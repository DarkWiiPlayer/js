/*
A somewhat refined Proxy generator that lets you selectively listen to changed
properties and react accordingly.

Example:
	const l = listener()
	l.listen("contract", contract => speaker.handle(contract))
	l.contract = new Contract()
*/

export default (target={}) => {
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
