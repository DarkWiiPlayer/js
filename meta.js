export default new Proxy(document.head, {
	get: (head, prop) => head.querySelector(`[name="${prop}"]`)?.content,
	set: (head, prop, value) => {
		let meta = head.querySelector(`[name="${prop}"]`)
		if (!meta) {
			meta = document.createElement("meta")
			meta.name = prop
			head.append(meta)
		}
		meta.content = value
		return true
	},
	deleteProperty: (head, prop) => {
		head.querySelector(`[name=${prop}]`)?.remove()
		return true
	},
})
