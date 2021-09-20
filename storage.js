export class ObjectStorage {
	#map = new Map()
	key(index) {
		return [...this.#map.keys()][index]
	}
	getItem(keyName) {
		if (this.#map.has(keyName))
			return this.#map.get(keyName)
		else
			return null
	}
	setItem(keyName, keyValue) {
		this.#map.set(keyName, keyValue)
	}
	removeItem(keyName) {
		this.#map.delete(keyName)
	}
	clear() {
		this.#map.clear()
	}
}
