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
		if ("object" == typeof prop && "forEach" in prop)
			prop.forEach(prop => this.listen(prop, callback))
		else if (callback)
			callbacks.set(prop, callback)
		else
			callbacks.delete(prop)
	}
	let proxy = new Proxy(target, {
		set: (target, prop, value) => {
			if (callbacks.has("*")) callbacks.get("*")(value, prop)
			if (callbacks.has(prop)) callbacks.get(prop)(value, prop)
			return Reflect.set(target, prop, value)
		},
		get: (target, prop, value) => {
			if (prop == "listen")
				return listen
			else
				return Reflect.get(target, prop)
		}
	})
	return proxy
}
