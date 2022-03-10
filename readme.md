DarkWiiPlayer/JS
================================================================================

A collection of general-purpose Javascript snippets/modules that I end up
copy-pasting around more often than necessary.

---

So what does it all do?

## Better

an "improved" version of the builtin HTMLElement that's hopefully a lot easier
to build actual things with. It's really just another utility layer.

## Element

the second iteration of improved `HTMLElement` but this time in a function to
support inheriting from other classes for extending builtin elements.

## CSS

Generate CSS from JS objects. Yes, you can generate CSS from JSON now. Or from
YAML. Or from whatever you want, really.

## Listener

A proxy object that fires a callback when certain (or all) properties are
changed.

## Speaker

Simple messaging helper that uses microtasks by default.

## Skooma

Generate HTML and SVG DOM nodes more easily and do stuff with them. Feels like
an in-between of using a templating language and writing lisp code. Overall very
recommendable.

## Template

Turns template literals directly into HTML templates. Just read the code, it's
like 5 lines or so.

## Storage

Currently a sngle class `ObjectStorage` implementing the API of the Storage
class using a plain JS Map as backend. This is mostly meant as a page-local
fallback to LocalStorage and SessionStorage
