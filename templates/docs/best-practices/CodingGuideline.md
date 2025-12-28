# Coding Guidelines

## Table of Contents

- [General](#general)
- [Classes](#classes)
- [Interfaces](#interfaces)
- [Types](#types)
- [Enum](#enum)
- [Objects](#objects)
- [Arrays](#arrays)
- [Destructuring](#destructuring)

## General

### Spaces

> Use 2 spaces. Not tabs.

Reason: The TypeScript/VSCode teams use 2 spaces but are definitely the exception in the ecosystem.

### Semicolons

> Use semicolons.

Reasons: Explicit semicolons helps language formatting tools give consistent results. Missing ASI (automatic semicolon insertion) can trip new devs e.g. foo() \n (() => {}) will be a single statement (not two). Recommended by TC39 as well.

### References

> Use const for most of your references; avoid using var.

Why? This ensures that you can't reassign your references (mutation), which can lead to bugs and difficult to comprehend code.

```typescript
// bad
var a: number = 1;
var b: number = 2;

// good
const a: number = 1;
const b: number = 2;
```

If you must mutate references, use let instead of var.

Why? let is block-scoped rather than function-scoped like var.

```typescript
// bad
var count = 1;
if (true) {
  count = count + 1;
}

// good, use the let.
let count: number = 1;
if (true) {
  count = count + 1;
}
```

Note that both let and const are block-scoped.

```typescript
// const and let only exist in the blocks they are defined in.
{
  let a = 1;
  const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
```

### Quotes and Strings

> Quotes

```typescript
// bad
page.locator('.query-btn');

// good
page.locator('.query-btn');
page.locator("[data-cy='events']").should('be.visible');
```

> Strings

```typescript
const a = 1;
const b = 2;

// bad (String Concatenation)
console.log('a + b = ' + (a + b));

// good (String Interpolation)
console.log(`a + b = ${a + b}`);
```

### Variable and Function

> Use camelCase for Variable and Function names.

### Comparison Operators & Equality

> Use === and !== over == and !=.

Conditional statements such as the if statements evaluate their expression using coercion with the ToBoolean abstract method and always follow these simple rules:

```typescript
Objects evaluate to true

Undefined evaluates to false

Null evaluates to false

Booleans evaluate to the value of the boolean

Numbers evaluate to false if +0, -0, or NaN, otherwise true

Strings evaluate to false if an empty string '', otherwise true
```

```typescript
if ([0]) {
  // true
  // An array is an object, objects evaluate to true
}
```

> Use shortcuts.

```typescript
// bad
if (name !== '') {
  // ...stuff...
}

// good
if (name) {
  // ...stuff...
}

// bad
if (collection.length > 0) {
  // ...stuff...
}

// good
if (collection.length) {
  // ...stuff...
}
```

### Blocks

> Use braces with multi-line blocks or omit braces for two line blocks.

```typescript
// bad
if (test) return false;

// ok
if (test)
  return false;

// good
if (test) {
  return false;
}

// bad
function() { return false; }

// good
function() {
  return false;
}
```

### Comments

> Use /\*_ ... _/ for multi-line comments. Include a description, specify types and values for all parameters and return values.

```typescript
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
const make = function (tag) {
  // ...stuff...

  return element;
};

// good
/**
 * make() returns a new element
 * based on the passed in tag name
 *
 * @param {String} tag
 * @return {Element} element
 */
const make = function (tag) {
  // ...stuff...

  return element;
};
```

> Use // for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment.

```typescript
// bad
const active = true; // is current tab

// good
// is current tab
const active = true;

// bad
const getType = function () {
  console.log('fetching type...');
  // set the default type to "no type"
  const type = this._type || 'no type';

  return type;
};

// good
const getType = function () {
  console.log('fetching type...');

  // set the default type to "no type"
  const type = this._type || 'no type';

  return type;
};
```

> Prefixing your comments with FIXME or TODO helps other developers quickly understand if you're pointing out a problem that needs to be revisited, or if you're suggesting a solution to the problem that needs to be implemented. These are different than regular comments because they are actionable. The actions are FIXME -- need to figure this out or TODO -- need to implement.

Use // FIXME: to annotate problems.

```typescript
class Calculator {
  constructor() {
    // FIXME: shouldn't use a global here
    total = 0;
  }
}
```

Use // TODO: to annotate solutions to problems.

```typescript
class Calculator {
  constructor() {
    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```

### Commas

> Leading commas: Nope.

```typescript
// bad
const story = [once, upon, aTime];

// good
const story = [once, upon, aTime];

// bad
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthYear: 1815,
  superPower: 'computers',
};

// good
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthYear: 1815,
  superPower: 'computers',
};
```

> Additional trailing comma: Yup.

Why? This leads to cleaner git diffs. Also, transpilers like Babel will remove the additional trailing comma in the transpiled code which means you don't have to worry about the trailing comma problem in legacy browsers.

```typescript
// bad - git diff without trailing comma
const hero = {
     firstName: 'Florence',
-    lastName: 'Nightingale'
+    lastName: 'Nightingale',
+    inventorOf: ['coxcomb graph', 'modern nursing']
}

// good - git diff with trailing comma
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing'],
}

// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
};

const heroes = [
  'Batman',
  'Superman'
];

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};

const heroes = [
  'Batman',
  'Superman',
];
```

## Classes

> Use PascalCase for class names.

Reason: This is fairly conventional in standard JavaScript/Typescript.

```typescript
// bad
class foo {}

// good
class Foo {}
```

> Use camelCase of class members and methods

Reason: Naturally follows from variable and function naming convention.

```typescript
// bad
class Foo {
  Bar: number;
  Baz() {}
}

// good
class Foo {
  bar: number;
  baz() {}
}
```

## Interfaces

> Use PascalCase for name.

Reason: Similar to class.

> Use camelCase for members.

Reason: Similar to class.

> Prefix with I.

Reason: Easily identify interfaces and avoids naming conflicts.

```typescript
// bad
interface IFoo {}

// good
interface Foo {}
```

## Types

> Use PascalCase for name.

Reason: Similar to class.

> Use camelCase for members.

Reason: Similar to class.

### Type vs. Interface

> Use type when you might need a union or intersection:

```typescript
type Foo = number | { someProperty: number };
```

> Otherwise Use interface.

```typescript
interface Foo {
  foo: string;
}
interface FooBar extends Foo {
  bar: string;
}
class X implements FooBar {
  foo: string;
  bar: string;
}
```

## Enum

> Use PascalCase for enum names.

Reason: Similar to Class. Is a Type.

```typescript
// bad
enum color {}
// good
enum Color {}
```

> Use PascalCase for enum member

Reason: Convention followed by TypeScript team i.e. the language creators e.g SyntaxKind.StringLiteral. Also helps with translation (code generation) of other languages into TypeScript.

```typescript
// bad
enum Color {
  red,
}

// good
enum Color {
  Red,
}
```

## Objects

> Use the literal syntax for object creation.

```typescript
// bad
const item = new Object();

// good
const item = {};
```

> Don't use reserved words as keys. It won't work in IE8. More info.

```typescript
// bad
const superman = {
  default: { clark: 'kent' },
  private: true,
};

// good
const superman = {
  defaults: { clark: 'kent' },
  hidden: true,
};
```

> Use arrow functions for object methods instead of shorthand properties or an anonymous function.

```typescript
// bad
const atom = {
  value: 1,
  addValue: function (value) {
    return atom.value + value;
  },
};

// bad
const atom = {
  value: 1,
  addValue(value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,
  addValue: (value) => atom.value + value,
};
```

## Arrays

Use the literal syntax for array creation.

```typescript
// bad
const items: string[] = new Array();

// good
const items: string[] = [];
```

> Use Array#push instead of direct assignment to add items to an array.

```typescript
const someStack: string[] = [];
// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

> Use array spreads ... to copy arrays.

```typescript
// bad
const len = items.length;
const itemsCopy: string[] = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

> To convert an array-like object to an array, use Array#from.

```typescript
const foo = document.querySelectorAll('.foo');
const nodes = Array.from(foo);
```

## Destructuring

> Use array destructuring.

```typescript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```
