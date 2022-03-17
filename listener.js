/*
A somewhat refined Proxy generator that lets you selectively listen to changed
properties and react accordingly.

Example:
	const l = listener()
	l.listen("contract", contract => speaker.handle(contract))
	l.contract = new Contract()
*/

const registry = new Map()
const listener = (target={}) => {
	const callbacks = new Map()
	const methods = Object.create(null)
	methods.listen = function(name, fn, {once=false}={}) {
		const callback = once
			? (...args) => { this.forget(name, callback); return fn(...args) }
			: fn
		let set = callbacks.get(name) ?? new Set()
		callbacks.set(name, set)
		set.add(callback)
		return this
	}
	methods.forget = function(name, callback) {
		if (callback) {
			const set = callbacks.get(name)
			if (set) return set.delete(callback)
		} else {
			return callbacks.delete(name)
		}
	}
	let proxy = new Proxy(target, {
		set: (target, prop, value) => {
			if (callbacks.has(null)) callbacks.get(null).forEach(callback => callback(value, target[prop], prop))
			if (callbacks.has(prop)) callbacks.get(prop).forEach(callback => callback(value, target[prop], prop))
			return Reflect.set(target, prop, value)
		},
		get: (target, prop, value) => prop in methods
			? methods[prop]
			: target[prop]
	})
	registry.set(proxy, target)
	return proxy
}

listener.raw = proxy => registry.get(proxy)

export default listener
