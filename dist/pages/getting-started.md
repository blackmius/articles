[Русская версия](#article;slug=getting-started-ru)

If you have already read this document, I will stop making you impatient.
[sources](https://blackmius.ru/shared/sources.zip)
[minified](https://blackmius.ru/shared/zombular.js)

# Getting started

Zombular is a powerful javascript micro-framework for building web applications
faster and reliable created in 2015 by Michael Lazarev.

What zombular author says about his framework (read with theater pafos)
>Zombular is supercombinatoric higher metaframework neither simple tag renderer.
It is crafted out of necessity to define metacomponents that can create interfaces on the fly from defines placed in database and created with interactive programming enviroment.

## Features

1. Blazing fast

    Zombular uses [cito.js](https://github.com/joelrich/citojs) that is one of
    the fastest virtual DOM library

2. Does not use moronic xml in js
3. Lightweight

    18 kb (minified)
    
    6.5 kb (mingzip)

4. Easy to use

    You just import the library and it works

## Example

The Zombular simpliest `Hello World` program looks like this:

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';
const Body = z._h1('Hello world');
z.setBody(Body);
```

Impressive, no? What if we add a Button to this code?

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

const Body = z('',
    z._h1('Hello, World!'),
    Button('Click me!', () => alert('YOU CLICKED THE BUTTON'))
);

z.setBody(Body);
```

Impressive? Still no? Okay. What if we make this button increase number after.

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

let counter = 0;

const Body = z('',
    z._h1('Hello, World!'),
    Button('Click me!', () => (counter++, z.update())),
    () => `you clicked ${counter} times.`
);

z.setBody(Body);
```

As you can see all your wants can be interpreted in few lines of code with zombular.

# Z function

This is least examples what you can do with Zombular. And if you reached
here and didn't close the tab let's consider it's API quite closer.

The `z` function first argument is string or object notation which determine
`tagname`, `classes`, `id`, `attributes` and `events` of the element.

Events differ from attributes only in prefix, all events must start with `on` prefix:
`onclick`, `onchange`, `oninput`, `onblur`, `onfocus` etc.

There are 3 special events `on$created`, `on$changed`, `on$destroyed` which
raised then element created, changed or destroyed from page accordingly.

The second and the rest `z` arguments are element's children

``` js
z('tagname.class1.class2#id',
    'Me child', 'And me child', 'no child is me');
```

Children can be `string`, `number`, `boolean`, `function` and `array` types

``` js
function a() { return 'a' + 1; }
z('', 0, 'string', true, false, a, [1, 'a', true]);
```

Notation can be written in 3 ways depending on your needs.

## Shorthand notation

Shortened notation used only for `tagname`, `classes` and `id`.

``` js
z('tagname.class1.class2#id');
```

If tagname not specified it will be default `<div>`

``` js
z('.class1.class2#id');
```

To insert pure html there is `<` tagname

``` js
z('<', `
<svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
`);
```

To insert html comment use `!` tagname

``` js
z('!', 'this is html comment');
```

If tag name is `empty string`, `null`, `empty object`, `false` or `undefined`
function does not wrap children to any tag.

``` js
z('div',
    z('',
        'child',
        z('h1', 'Hello'),
        z('p', 'p tag'),
    )
);
```

## Object notation

Object notation uses to specify attributes and events.

``` js
z({
    is: 'tagname',
    class: 'class1 class2',
    id: 'id',
    onclick: e => alert('clicked'),
    href: 'http://example.com'
});
```

Object attributes may be following types: `string`, `number`, `object`,
`boolean` and `function` type.

Object notation can also accept shortened notation form.

``` js
z({
    is: 'tagname.class1.class2#id',
    onclick: e => alert('clicked'),
    href: 'http://example.com'
});
```

Example, where `сlass` attribute is object.

``` js
z({
    is: 'tagname#id',
    class: {
            class1: true,
            class2: true,
    },
    onclick: e => alert('clicked'),
    href: 'http://example.com'
});
```

This allows to toggle classes.

``` demo
// file: style.css
.red { color: red; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

let counter = 0;

const Body = z('',
    z._h1('Hello, World!'),
    Button('Click me!', () => (counter++, z.update())),
    () => `you clicked ${counter} times.`,
    z({ is: 'h1',
        class: () => ({ red: counter >= 5 })
    }, 'Reach 5 to make me red'),
);
z.setBody(Body);
```

## Proxy notation

The last way to specify element attributes is using Proxy.

``` js
z._tagname.class.class1('child', 1, 2, 3);
z._tagname.class.class1({
        onclick: e => alert('clicked'),
        attribute: true
}, 'child', 1, 2, 3);
```

NB: To avoid ambiguity, for a shorthand notation, the first argument
can not be a function returning a specification, as a normal z-combinator
call allows. Otherwise, `z._div(z._div('a'))` is indistinguishable from
`z._div(()=>{is: '.quote'}, 'a')` by types of arguments.

# Updating app state

App state is changing by calling `z.update` function. Every time you are calling
this function all children which are functions are recalcuate:

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Body = z('',
    z._button({onclick: e => z.update()}, 'update'),
    z._h1(() => Math.random())
);
z.setBody(Body);
```

By calling `z.update(fn: callable)` you are schedule an update, queue function
call after it finishes.

To update app state immediately use `z.update(true)`.

Calls to `z.update(false, ctx)`, `z.update(true, ctx)` and `z.update(fn, ctx)`
change the initial context by updating it from `ctx` parameter.

Calls to `z.update` during the update phase (i.e. directly from function's,
childern of z) have no effect.

Function `z.update()` must be called from callbacks.

``` demo
// file: style.css
.highlight { padding: 4px 0; background-color:yellow; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

function highlight(...s) {
    let str = s.join('');
    return ctx => {
        if (ctx.search) {
            return z.each(
                str.split(ctx.search),
                i=>i,
                z._span.highlight(ctx.search),
            );
        }
        return z('', str);
    }
}

const text = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed velit mauris, tincidunt eu elit at, laoreet egestas est.
Pellentesque in vehicula tellus. Cras pellentesque urna velit,
volutpat mattis leo egestas id. Sed risus magna, placerat eget
pharetra eu, vestibulum ut erat. Nunc ut sem ut magna dapibus
efficitur. Donec id nibh vitae eros dictum pharetra vel non nisi.
Cras sapien nulla, mollis eu turpis id, feugiat ultrices mauris.
In rhoncus leo in ex commodo, non aliquam est convallis. Aenean
convallis tincidunt ultrices. Nullam sem neque, feugiat ut massa et,
pharetra hendrerit eros. Aliquam suscipit tellus elit, quis gravida
nulla vestibulum ut.
`;

const Body = z('',
    z._button({
        onclick: e => z.update(false, {search: 'et'})
    }, 'highlight'),
    highlight(text)
);
z.setBody(Body);
```

# z.Node

Zombular can manage not only over document.body, you can easily make vdom node
by calling z.Node function.

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

let color = 'red';

const Styles = z('style', `
body { color: ${color}; }
`,
() => `.c0 { color: ${color}; }`
);

const head = z.Node(document.head, Styles);

color = '#234196';
head.update();

const Body = z._h1('Zombular', z._span.c0('ROCK'));

z.setBody(Body);
```

# Data binding

Zombular provides it's own way to binding data. But Zombular does not stressed
the importance of own way, so you can use something else.

## z.Val
   
``` js
const val = z.Val(v);
val.set(v);
val.get(); // -> val
``` 

## z.Ref

``` js
const obj = { key: 'val' };
const ref = z.Ref(obj, 'key');
ref.set(v); // obj['key'] = v
ref.get(); // -> obj['key']
``` 

``` demo
// file: style.css
.l { display:block; margin: 6px auto; }
.error{ text-align: center; color: red; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

let credentials = {};
let loggedIn = false;
let error;

const Input = (val, type, placeholder) => z._input.l({value: val.get, type,
  oninput: e => (val.set(e.target.value), z.update()), placeholder
});

function login(username, password) {
  if (username === 'admin' && password === '12345') {
    loggedIn = true;
  } else {
    error = 'Username or Password is incorrect';
  }
  z.update();
}

const Body = z('',
  _ => loggedIn != true ? z('',
    Input(z.Ref(credentials, 'username'), 'text', 'Enter your name'),
    Input(z.Ref(credentials, 'password'), 'password', 'Enter your password'),
    z.error(error),
    z._button.l({onclick: e => login(credentials.username, credentials.password)}, 'Login'),
  ) : z._h1(`Hello, ${credentials.username}`)
)

z.setBody(Body);
```

# Routing

z.route()
- returns a current route as a `{ route, args }` object

z.route([path,] args)
- A reverse of z.route() call. If that one can be thought of as a getter,
  this one is a setter. `args` is an object of the form `{ arg1: val1, ... }`
  All values are strings, beacuse we are dealing with URL parameters.
  Returns an URL you can use in `location.assign` or `location.replace`.
  URL format is `#path;arg1=val1;arg2=val2`.
  If `path` is null, the URL to update the arguments of the current route
  is returned.

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Link = (text, href) => z._a({href}, text);

const Body = z('',
  z._style(`a{margin-right: 6px;}`),
  () => z._p(`current location is ${location.hash}`),
  function() {
    let {route, args} = z.route();
    if (route === '')
      return Link('next', '#next')
    else if (route === 'next')
      return Link('next', '#next1')
    else if (route === 'next1')
      return z('',
        Link('red', z.route(null, {color: 'red'})),
        Link('green', z.route(null, {color: 'green'})),
        Link('blue', z.route(null, {color: 'blue'})),
        z._div({style: `color:${args.color}`}, 'Change my color!!!!'),
      )
  }
)

z.setBody(Body);
```

# What next?

It seems you reach the end of tutorial. If you thirsting in more examples
I maked few for you.

[More Examples](https://blackmius.ru/articles/#article;slug=zombular-examples)

enjoy <3

