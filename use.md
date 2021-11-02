# Use

A helper module to connect the world of modular javascript with that of plain
HTML.

## Rationale

The problem this module tries to solve is that of connecting behaviours defined
in a JavaScript module to HTML tags without having to:

- Select elements by ID
- Build a custom system to select elements uniquely
- Generate the HTML nodes directly in JavaScript

The solution this module provides is a `use` attribute, which can be set on an
element in HTML, which will be evaluated as JS and interpreted as follows:

- If it is a function, call it on the element
- If it is a promise, await it and retry with its result
- If it is a module, retry with its `default` value

This allows setting specific functionality on individual elements.

**Note** the adjacency to custom elements and customized builtin elements, and
how patterns in the usage of `use` may often be refactored into either of these.

## Limitations

For performance reasons, this module does not listen on attribute changes.
Since the focus of this module is to interact with plain HTML, any nodes
modified within JavaScript fall outside of its scope, and any code that adds a
`use` attribute to them should just call the desired function directly on the
node.

## Interface / Examples

```js
use.run(root=document)
// Runs once on all the children of its root.

use.observe(root=document)
// Observes the given root and runs on all newly added
// child elements. Does not perform an initial run over
// already existing elements.

use.use(element)
// Runs once on a selected element.
// Normally not recommended.

use.install()
// Observes the entire document and performs
// an initial scan over existing elements.
```
