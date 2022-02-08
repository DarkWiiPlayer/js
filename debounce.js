export default (action, delay=1e3) => {
	let timeout
	const func = (...args) => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			timeout = undefined
			action(...args)
		}, delay)
	}
	func.cancel = () => {
		if (timeout) clearTimeout(timeout)
		timeout = undefined
	}
	func.now = (...args) => {
		func.cancel()
		return action(...args)
	}
	return func
}
