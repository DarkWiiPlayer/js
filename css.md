# CSS

A simple module for generating CSS from JS and a helper for custom properties
aka. CSS variables.

## Interfaces

```js
import {css} from 'css.js'

// CamelCase will be turned into kebab-case
css({div: {backgroundColor: "red"}})
// will produce:
// div {background-color: red}

css({div: {
	transition: ["border 1s", ["color", "2s"]]
}})
// will produce:
// div {transition: border 1s, color 12}

// Nesting will be resolved
css({
	".foo": {
		color: "purple",
		".bar": {
			color: "red",
		},
		".baz": {
			color: "blue",
		},
	},
})
// will produce:
// .foo {color: purple}
// .foo .bar {color: red}
// .foo .baz {color: blue}

// Nested lists will be resolved too
css({
	".foo": {
		color: "purple",
		".bar, .baz": {
			color: "red",
		},
	},
})
// will produce:
// .foo {color: purple}
// .foo .bar, .foo .baz {color: red}

// A leading _ will remove the space when nesting
css({
	".foo": {
		color: "black",
		"_bar": { color: "red" }
	}
})
// will produce:
// .foo {color: black}
// .foobar {color: red}

// $ will be replaced with . for convenience
// This can be combined with _ for to avoid quoting keys
css({
	$foo: {
		_$bar$baz: {
			color: 'red'
		}
	}
})
// will produce:
// .foo.bar.baz {color: red}
```

Variables helper:

```js
import {variable as v} from 'css.js'

// Index for automatic hyphenation
v.fooBar.toString() // var(--foo-bar)
v.fooBar("Hello") // var(--foo-bar, Hello)

// Call for unchanged variable names
v("fooBar") // var(--fooBar)
v("fooBar", "Hello") // var(--fooBar, Hello)
```

## Examples
