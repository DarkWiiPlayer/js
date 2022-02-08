export default (action, delay=1e3) => {
	let timeout
	return (...args) => {
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(() => {
			timeout = undefined
			action(...args)
		}, delay)
	}
}
