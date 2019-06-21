[English version](#article;slug=getting-started)

Если вы уже прочитали эту статью, не буду вас томить.
[исходники](https://blackmius.ru/shared/sources.zip)
[минифицированная](https://blackmius.ru/shared/zombular.js)

# Введение

Zombular это мощный javascript микро-фреймворк, созданный Михаилом Лазаревым в 2015 году,
для быстрого и надежного построения веб приложений.

Что автор zombular говорит о своем фреймворке(читать с театральным пафосом)
>Зомбуляр -- это суперкомбинаторный метафреймворк высшего порядка, а не просто рисовалка тегов. Он создавался из необходимости определять метакомпоненты, которые могут на лету создавать интерфейсы из определений, размещенных в базе данных и полученных в среде интерактивного программирования.

## Плюсы

1. Очень быстрый

    Zombular использует внутри себя [cito.js](https://github.com/joelrich/citojs),
    которая является быстрейшей библиотекой для vdom манипуляций
    
2. Не использует xml в javascript
    
    Да, это плюс
    
3. Легковесный

    18 kb (минифицированная)
    
    6.5 kb (минифицированная и сжатая)

4. Легка в использовании

    Вы просто импортируете библиотеку, и она работает
    
## Пример

Простейшая `Привет Мир` программа на zombular выглядит следующим образом.
``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';
const Body = z._h1('Всем чмоки!');
z.setBody(Body);
```

Впечатлены, нет? Что если мы добавим кнопку к этому коду?

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

const Body = z('',
    z._h1('Всем чмоки!'),
    Button('Click me!', () => alert('ВЫ НАЖАЛИ НА КНОПКУ'))
);

z.setBody(Body);
```

Впечатлены? Все еще нет? Хорошо. Что если мы заставим эту кнопку увеличивать число после?

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

let counter = 0;

const Body = z('',
    z._h1('Всем чмоки!'),
    Button('Тыкни в меня!', () => (counter++, z.update())),
    () => `Вы тыкнули ${counter} раз.`
);

z.setBody(Body);
```

Как вы видите, все ваши хотелки могут быть интерпретированы в пару строчек
с помощью zombular.

# Z функция

Это было меньшее из того, что можно делать, используя zombular. И если вы
дочитали до сюда, не закрыв вкладку, то давайте рассмотрим его API немного ближе.

Первый аргумент `z` Функции может быть либо строкой, либо объектом, описывающие
`тег`, `классы`, `идентификатор`, `события` или другие аттрибуты элемента.

Все события записываются с приставкой `on`: `onclick`, `onchange`, `oninput`,
`onblur`, `onfocus` и так далее...

Есть 3 __специальных__ события `on$created`, `on$changed`, `on$destroyed`,
который взводятся, когда элемент создался, поменялся, или был уничтожен соответственно.

Последующие аргументы `z` это дети элемента.

``` js
z('tag.class1.class2#id',
    'Я ребенок', 'Я тоже', 'Нет, я ребенок');
```

Дети могут быть `строкой`, `числом`, `логическим значением`, `функцией` и `массивом`.

``` js
function a() { return 'a' + 1; }
z('', 0, 'строка', true, false, a, [1, 'а', true]);
```

Описание элемента может быть записано 3 путями, в зависимости от ваших потребностей.

## Короткая запись

Этим способом можно описать только `тег`, `классы` и `идентификатор`.

``` js
z('tag.class1.class2#id');
```

Если тег не указан, то по умолчанию он будет `<div>`.

``` js
z('.class1.class2#id');
```

Чтобы вставить чистый html, существует тег `<`.

``` js
z('<', `
<svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
`);
```

Чтобы вставить html комментарий, используйте тег `!`.

``` js
z('!', 'Это комментарий в html');
```

Если тег это `пустая строка`, `null`, `пустой объект`, `false` или `undefined`
функция не будет оборачивать его детей в тег.

``` js
z('div',
    z('',
        'ребенок',
        z('h1', 'чмоки'),
        z('p', 'тег p'),
    )
);
```

## Объектная запись

Такую форму записи используют, чтоб описать аттрибуты или события для элемента.

``` js
z({
    is: 'tagname',
    class: 'class1 class2',
    id: 'id',
    onclick: e => alert('жмак'),
    href: 'http://example.com'
});
```

Аттрибуты объекта могу быть `строкой`, `числом`, `объектом`,
`логическим значением` или `функцией`.

Объектное описание также принимает короткую запись.

``` js
z({
    is: 'tagname.class1.class2#id',
    onclick: e => alert('жмак'),
    href: 'http://example.com'
});
```

Пример, когда аттрибут `сlass` это объект

``` js
z({
    is: 'tagname#id',
    class: {
        class1: true,
        class2: true,
    },
    onclick: e => alert('жмак'),
    href: 'http://example.com'
});
```

Это позволяет переключать классы.

``` demo
// file: style.css
.red { color: red; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Button = (text, onclick) => z._button({onclick}, text);

let counter = 0;

const Body = z('',
    z._h1('Hello, World!'),
    Button('тыкни в меня!', () => (counter++, z.update())),
    () => `Вы тыкнули ${counter} раз.`,
    z({ is: 'h1',
        class: () => ({ red: counter >= 5 })
    }, 'Тыкни 5 раз, и я стану красным'),
);
z.setBody(Body);
```

## Proxy

Последний способ определения аттрибутов элемента это использование Proxy.

``` js
z._tagname.class.class1('ребенок', 1, 2, 3);
z._tagname.class.class1({
        onclick: e => alert('Жмак'),
        attribute: true
}, 'ребенок', 1, 2, 3);
```

Чтобы избежать непоняток для укороченной записи, первый аргумент не может быть
функцией, возвращающей описание элемента. Иначе, `z._div(z._div('a'))` неотличим
от `z._div(()=>{is: '.quote'}, 'a')` по типу аргументов.

# Смена состояния приложения

Состояние приложения меняется вызовом функции `z.update`. Каждый раз, когда вы
вызываете эту функцию все динамические части перевычисляются.

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const Body = z('',
    z._button({onclick: e => z.update()}, 'Обновить'),
    z._h1(() => Math.random())
);
z.setBody(Body);
```

Вызывая `z.update(fn: callable)` вы планируете вызов `z.update`, закидывая функцию
в очередь, вызывающуюся после его окончания.

Для неотложного обновления состояния используйте `z.update(true)`.

Вызовы `z.update(false, ctx)`, `z.update(true, ctx)` и `z.update(fn, ctx)`
меняют начальный контекст на параметр `ctx`.

Вызовы `z.update` во время фазы обновления (другими словами, прямо из потомка z),
не имеют эффектом. Функция `z.update()` должны вызываться из callback`ов.

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
    }, 'Выделить'),
    highlight(text)
);
z.setBody(Body);
```

# z.Node

Zombular способен управлять не только document.body, вы легко можете сделать vdom узел
вызовом функции z.Node.

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

# Привязка данных

Zombular предоставляет свой собственный способ привязки данных. Но не настаивает
на правильности этого способа, так что вы можете использовать что-нибудь другое.

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
    error = 'Неверное имя пользователя или пароль';
  }
  z.update();
}

const Body = z('',
  _ => loggedIn != true ? z('',
    Input(z.Ref(credentials, 'username'), 'text', 'Введите имя'),
    Input(z.Ref(credentials, 'password'), 'password', 'Введите пароль'),
    z.error(error),
    z._button.l({onclick: e => login(credentials.username, credentials.password)}, 'Войти'),
  ) : z._h1(`Hello, ${credentials.username}`)
)

z.setBody(Body);
```

# Маршрутизация

`z.route()`
- возвращает текущий маршрут как объект `{ route, args }`.

`z.route([path,] args)`
- Обратный вызов `z.route()`. Если тот можно считать получателем,
    то этот установщиком. `args` это объект формы `{ arg1: val1, ... }`
    Все значения это строки, потому что мы работаем с URL параметрами.
    Полученный URL вы можете использовать в `location.assign` или `location.replace`.
    Формат URL таков `#path;arg1=val1;arg2=val2`.
    Если `path` это `null`, то вернется URL с текущим путем.

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
        Link('Красный', z.route(null, {color: 'red'})),
        Link('Зеленый', z.route(null, {color: 'green'})),
        Link('Голубой', z.route(null, {color: 'blue'})),
        z._div({style: `color:${args.color}`}, 'Смени мне цвет!!!!'),
      )
  }
)

z.setBody(Body);
```

# Что дальше?

Похоже, что вы добрались до конца руководства. Если вы жаждете больше примеров,
то я сделяль парочку для вас.

[Больше примеров](https://blackmius.ru/articles/#article;slug=zombular-examples)

Наслаждайтесь ❤️

