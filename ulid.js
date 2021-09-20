const lookup = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

const base32 = array => {
	const size = array.BYTES_PER_ELEMENT * 8
	const b32_length = Math.ceil(array.length * size / 5)
	const buffer = new Array(b32_length)
	let pointer = array.length
	let acc = array[--pointer]
	let bits = size
	for (let i=b32_length-1; i>=0; --i) {
		while (bits < 5) {
			if (pointer > 0)
				acc += (array[--pointer] * 2 ** bits)
			bits += size
		}
		buffer[i] = lookup[acc % 32]
		acc = Math.floor(acc / 32)
		bits -= 5
	}
	return buffer.join('')
}

const bytes = length => integer => {
	const array = new Uint8Array(length)
	for (let i=length-1; i>=0; --i) {
		array[i] = Math.floor(integer % 256)
		integer = integer / 256
	}
	return array
}

export default (time = Date.now()) => {
	const array = new Uint8Array(16)
	array.set(bytes(6)(time))
	array.set(crypto.getRandomValues(new Uint8Array(10)), 6)
	return base32(array)
}
