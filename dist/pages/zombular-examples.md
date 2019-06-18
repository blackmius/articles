# Calculator

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

let res = '0';

const cal = e => {
    try {
        res = eval(res || '0');
        if (res == Infinity || res == -Infinity)
            throw new Error();
    } catch(e) { res = 'Error'; }
}
const clr = e => res = '0';
const add = n => e => {
    if (res == '0' || res == 'Error') res = n;
    else res += n;
}

const Button = (text, action, c) => z._button({
    onclick(e) { action(e); z.update(); },
    class: c
}, text);

const Keys = z.keys(
    ['+', '-', '*', '/'].map(
      o => Button(o, add(` ${o} `), 'ko')),
    [7,8,9,4,5,6,1,2,3,0,'.'].map(n=>Button(n, add(''+n))),
    Button('C', clr), Button('=', cal, 'ke'),
);

const Display = _ => z.disp(res);
const Calculator = z.calc(Display, Keys);
z.setBody(Calculator);

// file: style.css
* { box-sizing: border-box; margin: 0; }
html { font: 300 24px/1.3 Helvetica, Arial, sans-serif; }
body { display: flex; justify-content: center;
    background: #acb6e5; margin: 45px; }
button { outline: none; border: 0; font: inherit;
  	cursor: pointer; }

.calc { border-radius: 12px; margin: auto; overflow: hidden;
    box-shadow: 0 0 40px 0px rgba(0, 0, 0, 0.15);
  	height: fit-content; }

.disp { background: #222; color: #fff; text-align: right;
    font-size: 1.714285714em; padding: 0.5em 0.75em; }

.keys { background: #999; display: grid; grid-gap: 1px;
    grid-template-columns: repeat(4, 1fr); }
.keys > * { background: #fff; padding: 0.5em 1.25em;
    position: relative; text-align: center; }
.keys > *:active::before { content: "";  opacity: 0.3;
  	z-index: 1; background-color: rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5) inset;
    position: absolute; left: 0;
  	right: 0; top: 0; bottom: 0; }

.ko { background: #eee; }
.ke { background: #ff7033; grid-column: -2;
  	grid-row: 2 / span 4;}
```

# Emoji search

``` demo
// file: style.css
html { font-family: sans-serif; }
.emoji { padding: 8px; cursor: pointer;
  font-family: monospace; }
.emoji img { width: 18px; height: 18px; }
.emoji:hover { background: #f5f5f5; }
.gr { display: grid;
  grid-template-columns: repeat(auto-fill, 34px); }
.gr.text { grid-template-columns: repeat(2, 1fr); }
.spl { margin-left: 15px; } .spl0 { margin-left: 5px; }
.checkbox { height: 16px; width: 16px; margin: 0;
    display: inline-block; border: 2px solid #5a5a5a;
    position: relative; cursor: pointer;
	border-radius: 3px;}
.checkbox.checked { background: #5a5a5a; }
.checkbox.checked::after { content: '\2713'; color: #fff;
    position: absolute; top: -4px; font-size: 20px;  }
input { border: 0; border-bottom: 1px solid #5a5a5a;
    outline: none; padding-bottom: .2em; font-size: 20px; }
.c { display: flex; align-items: center; }

// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

let emojis;
fetch('https://unpkg.com/emojilib@2.4.0/emojis.json')
.then(res => res.json())
.then(json => {
    emojis = json;
    Object.keys(emojis).forEach(e => {
        emojis[e].keywords = emojis[e].keywords.join(',')
          + ',' + e;
    })
    res = Object.keys(emojis);
    z.update();
});

const Emoji = e => z.emoji.c(
    z._img({
        src: 'https://twemoji.maxcdn.com/2/72x72/'
            + emojis[e].char.codePointAt(0).toString(16)
            + '.png'
    }),
    text.get() ? z.spl(`:${e}:`) : ''
);

let res = [], text = z.Val(true);

const Checkbox = val => z.checkbox({
    class: { checked: val.get },
    onclick(e) { val.set(!val.get()); z.update() }
});

function find(e) {
    let value = e.target.value.toLowerCase();
    if (value === '') res = Object.keys(emojis);
    else res = Object.keys(emojis).filter(
        e => emojis[e].keywords.includes(value));
    z.update();
}

const Search = z.c(
    z._input({ placeholder: 'Search', oninput: find }),
    z.spl(Checkbox(text)), z.spl0('Toggle names'));
const Emojis = _ => z.gr({
    class: {text: text.get()}
}, (text.get()
    ? res.slice(0, 20)
    : res.slice(0, 200)).map(Emoji));

const Body = z('', Search, z._hr(), Emojis);
z.setBody(Body);
```

# Todo

``` demo
// file: style.css
@import url('https://unpkg.com/todomvc-app-css@2.2.0/index.css');


// file: storage.js
const prefix = 'TODO';
export const storage = new Proxy(localStorage, {
    get(s, p) {
        try { return JSON.parse(s[prefix+p]);
        } catch(e) { return null; }
    },
    set(s, p, v) {
        s[prefix+p] = JSON.stringify(v);
        return true;
    }
});

let id = storage['id'] || 0;
export const ids = storage['ids'] || [];

export function get(id, prop) {
    return storage[id+prop];
}
export function set(id, prop, value) {
    storage[id+prop] = value;
}
export function newid() { return ++id; }


// file: todo.js
import z from 'https://blackmius.ru/shared/zombular.js'
import { storage, get, set, newid, ids } from './storage.js';

export class Todo {
    constructor(data) {
        if (typeof data == 'object') {
            this.id = newid();
            ids.push(this.id);
            storage['ids'] = ids;
            data.id = this.id;
            Object.entries(data).forEach(
                ([key, val]) => set(this.id, key, val));
            z.update();
        } else {
            if (ids.includes(data)) this.id = data;
            else throw new Error('unknown id'); 
        }
        return new Proxy(this, {
            get(t, p) {
                if (t[p]) return t[p];
                return get(t.id, p);
            },
            set(t, p, v) {
              set(t.id, p, v);
              z.update();
              return true;
            }
        });
    }
    remove() {
        ids.splice(ids.indexOf(this.id), 1);
        storage['ids'] = ids;
        z.update();
    }
}

export const Todos = ids => ids.map(id => new Todo(id));
export function all() {
    return Todos(ids);
}
export function active() {
    return Todos(ids.filter(id => !get(id, 'completed')));
}
export function completed() {
    return Todos(ids.filter(id => get(id, 'completed')))
}

export function remaining() {
    return ids.filter(id => !get(id, 'completed')).length;
}

export { ids } from './storage.js';

// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js'
import { Todo, Todos, active, completed,
        remaining, all, ids } from './todo.js';

let edited;
function cancelEdit() { edited = null; z.update(); }

let filter = all;

const Info = z._footer.info(
    z._p('Double-click to edit a todo')
);

const flist = [['All', all], ['Active', active],
               ['Completed', completed]];

const Filters = z._ul.filters(
    flist.map(
        ([text, f]) => z._li(
            z._a({
                href: '#',
                class: { selected: _ => filter == f },
                onclick(e) { filter = f; z.update(); }
            }, _ => text)
        )
    )
);

const Footer = z._footer.footer(
    _ => z._span['todo-count'](
        z._strong(remaining),
        remaining() === 1 ? ' item' : ' items',
    ' left'),
    Filters,
    _ => completed().length
        ? z._button['clear-completed']({
            onclick(e) {
              completed().forEach(i => i.remove()); }
        }, 'Clear completed')
        : ''
);

const edit = {};

const TodoEl = todo => z._li.todo({
    class: {
        completed: todo.completed,
        editing: edited ? todo.id == edited.id : false,
    }
}, z.view(
    z._input.toggle({
        type: 'checkbox',
        onchange(e) { todo.completed = e.target.checked; },
        checked: todo.completed
    }),
    z._label({
        ondblclick(e) {
            edited = todo;
            z.update();
            setTimeout(_ => edit[todo.id].focus(), 0);
        }
    }, todo.title),
    z._button.destroy({
        onclick(e) { todo.remove(); }
    })
),
    z._input.edit({
        value: todo.title,
        on$created(e) { edit[todo.id] = e.target; },
        onblur: cancelEdit,
        onkeyup(e) {
            if (e.keyCode == 13) {
                edited = null;
                let val = e.target.value.trim();
                if (!val) todo.remove();
                else todo.title = val;
            } else if (e.keyCode == 27 ) cancelEdit();
        }
    })
)

const Main = _ => ids.length ? z._section.main(
    z._input['toggle-all']({
        id: 'toggle-all', type: 'checkbox',
        checked: !remaining(),
        oninput(e) {
          all().forEach(
            i => i.completed = e.target.checked); }
    }),
    z._label({for: 'toggle-all'}),
    z._ul['todo-list']( _ => filter().map(TodoEl) )
) : '';

const Header = z._header.header(
    z._h1('todos'),
    z._input['new-todo']({
        placeholder: "What needs to be done?",
        onkeydown(e) {
            if (e.keyCode == 13) {
                let value = e.target.value.trim();
                if (value) {
                    new Todo({
                      title: value,
                      completed: false });
                    e.target.value = '';
                }
            } 
        }
    })
);

const Body = z('',
    z._section.todoapp(Header, Main, _ => ids.length
                       ? Footer : ''),
    Info
);
z.setBody(Body);

```

# Minesweeper

``` demo
// file: style.css
body { background: #bdbdbd; font-family: monospace; text-align: center; }
.b0 { border: 2px solid #fff; border-bottom-color: #7b7b7b;
    border-right-color: #7b7b7b; }
.b1 { border: 2px solid #7b7b7b; border-bottom-color: #fff;
    border-right-color: #fff; }
.b0, .b1 { background: #bdbdbd; }
.ib { display: inline-block; }
.cp { cursor: pointer; }
.cell { width: 16px; height: 16px; text-align: center; }
.cell.open { border: 1px solid #7b7b7b; padding: 1px; font-weight: bold; }
.cell.flag { color: #444; }
.l1 { color: purple; } .l2 { color: green; } .l3 { color: red; }
.l4 { color: darkblue; } .l5 { color: brown; } .l6 { color: cyan; }
.l7 { color: black; } .l8 { color: grey; }
.main { padding: 5px; margin: auto; }
.g { display: flex; } .g.js { justify-content: space-between; }
.grid { margin-top: 5px; }
.scr { background: black; color: red; font-weight: bold;
    font-size: 24px; padding: 4px; }
.st { font-size: 18px; display: flex; justify-content: center;
    align-items: center; width: 32px; }

// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

const randint = n => Math.floor(Math.random() * n);

const neighbors = [[-1, -1], [0, -1], [1, -1], [-1, 0],
    [1, 0], [-1, 1], [0, 1], [1, 1]];

function initMap(w, h, b) {
    let res = Array.from({length: h},
        _ => Array.from({length: w}, _ => ({ n:0 })));
    res.bombs = [];
    while (b) {
        let x = randint(w), y = randint(h);
        if (res[y][x].n != 9) {
            res[y][x] = {n:9};
            neighbors.forEach(([dx, dy]) => {
                let cell = (res[y+dy] || [])[x+dx];
                if (cell && cell.n != 9) cell.n += 1;
            });
            res.bombs.push(res[y][x]);
            b--;
        }
    }
    return res;
}

let width = 9, height = 9, bombs = 10;
let flags, win, loose, map, time, timer;

function restart() {
    map = initMap(width, height, bombs);
    win = loose = false;
    flags = bombs;
    time = 0;
    timer = null;
    z.update();
}

restart();

function fill(x, y) {
    if (!(-1 < x && x < width
       && -1 < y && y < height)) return;
    if (map[y][x].o) return;
    map[y][x].o = true;
    if (map[y][x].n > 0) return;
    neighbors.forEach(([dx, dy]) => fill(x+dx, y+dy));
}

function open(x, y) {
    if (map[y][x].f) return;
    if (map[y][x].n == 9) {
        loose = true;
        clearInterval(timer);
    } else if (map[y][x].n > 0) {
        map[y][x].o = true;
    } else fill(x, y);
    z.update();
}

function flag(x, y) {
    if (map[y][x].o) return;
    if (map[y][x].f) {
        map[y][x].f = false;
        flags += 1;
    } else {
        if (flags == 0) return;
        map[y][x].f = true;
        flags -= 1;
    }
    win = map.bombs.every(b => b.f);
    if (win) clearInterval(timer);
    z.update();
}

const pad = (n, l) => (''+n).padStart(l, '0');

const Disp = _ => z.disp.b1.g.js(
    z.scr(pad(flags, 2)),
    z.b0.st.cp({
        class: { cp: win || loose },
        onclick(e) { if (win || loose) restart(); }
    }, loose ? '\u{1F628}' : win
               ? '\u{1F63a}' : '\u{1F60A}'),
    z.scr(pad(time, 3))
);

const Grid = z.grid.ib.b1(_ => map.map(
    (row, y) => z.g(row.map(
        ({f, o, n}, x) => z.cell.b0({
            class: {
                cp: !o, bomb: loose && n == 9,
                flag: f, open: o, ['l'+n]: o },
            onmousedown(e) {
                if (win || loose) return;
                if (time == 0 && !timer)
                  timer = setInterval( _ => {
                    time += 1;
                    z.update();
                }, 1000);
                if (e.which == 1) open(x, y);
                else if (e.which == 3) flag(x, y);
            },
            oncontextmenu(e) { e.preventDefault(); }
        }, o && n ? n :
            f ? "\u2691" : loose && n == 9
                                    ? "\uD83D\uDCA3" : '')
    ))
));

const Main = z.main.b0.ib(Disp, Grid);
z.setBody(Main);

```

# Periodic table

``` demo
// file: style.css
body { background: #1a1f2c; font-family: sans-serif; }
.tb { display: grid; grid-template-columns: repeat(18, 1fr);
    grid-template-rows: repeat(10, 32px); }
.rect { position: relative; }
.el { position: absolute; width: 100%; height: 100%;
    color: #ffffff8c; cursor: pointer;}
.el:hover { color: #fff; }
.bg { position: absolute; width: 100%; height: 100%; }
.el:hover .bg { opacity: .6; }
.f0 { font-size: 16px; }
.f1 { font-size: 12px; }
.c0 { color: #ccc; }
.c1 { color: #888; }
.nu { position: absolute; top: 2px; left: 2px; font-size: 2%; }
.s { position: absolute; font-size: 75%; top: 25%; width: 100%;
    text-align: center; font-weight: bold; }
.na { position: absolute; font-size: 10%; width: 100%;
    bottom: 3px; text-align: center; }
.tc { text-align: center; }
.sp1 { margin-top: 10px; }
.spl { margin-left: 16px; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

let data = [];
fetch('https://raw.githubusercontent.com/'
    + 'Bowserinator/Periodic-Table-JSON/'
    + 'master/PeriodicTableJSON.json')
.then(res => res.json())
.then(json => {
    data = json.elements;
    z.update();
});

const colors = {
    'diatomic nonmetal': '#353677',
    'polyatomic nonmetal': '#353677',
    'alkaline earth metal': '#5f4637',
    'transition metal': '#333e51',
    'unknown, probably transition metal': '#333e51',
    'noble gas': '#57317e',
    'unknown, predicted to be noble gas': '#57317e',
    'alkali metal': '#722f3d',
    'unknown, but predicted to be an alkali metal': '#722f3d',
    'metalloid': '#155464',
    'unknown, probably metalloid': '#155464',
    'post-transition metal': '#1c6449',
    'unknown, probably post-transition metal': '#1c6449',
    'lanthanide': '#4a396e',
    'actinide': '#402550'
}

let selected;

const rect = (x, y, w=0, h=0) => (...c) => z.rect({
    style: `grid-area: ${y} / ${x} / ${y+h} / ${x+w}`
}, ...c);

const Element = el => rect(el.xpos, el.ypos)(
    z.el({
        onmousemove(e) { selected = el; z.update(); }
    }, z.bg({style: `background: ${colors[el.category]}`}),
       z.nu(el.number), z.s(el.symbol), z.na(el.name))
);

const prop = (title, val) => z.tc(
    z.f1.c1.sp1(title), z.f0.c0.sp1(val || 'undefined')
)

const Table = _ => z.tb(
    data ? data.map(Element) : '',
    selected ? z('',
        rect(3, 1, 10)(
            z.spl(
                z.f0.c0(selected.number, ' - ', selected.name),
                z.f1({
                    style: `color: ${colors[selected.category]}`
                }, selected.category)
        )),
        rect(3, 2, 2)(prop('Phase', selected.phase)),
        rect(6, 2, 3)(prop('Atomic mass', selected.atomic_mass)),
        rect(10, 2, 2)(prop('Density', selected.density))
    ) : ''
);

z.setBody(Table);
```

# Kanban

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';
const Style = z._style(``);
const Body = z('', Style);
z.setBody(Body);
```

# NPM trends
``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

import 'https://blackmius.ru/shared/moment.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.js';

const sgURL = 'https://api.npms.io/v2/search/suggestions?size=5&q=';
const pkgURL = 'https://api.npms.io/v2/package/';
const mz = 'https://flat.badgen.net/bundlephobia/minzip/';
const bp = 'https://bundlephobia.com/result?p=';
const dw = 'https://api.npmjs.org/downloads/range/';

const day = 1000*60*60*24;

function dateRange(last) {
	let today = new Date();
    let before = new Date(today - last);
    today = today.toLocaleDateString('AF');
    before = before.toLocaleDateString('AF');
    return before + ':' + today;
}

const dates = {
    'week': dateRange(day*7),
    'month': dateRange(day*30),
    '3 month': dateRange(day*90),
    'half year': dateRange(day*180),
    'year': dateRange(day*365)
}

let range = 'week';

let chart;

function setData() {
	if (!chart) return;
    let datasets = [], last = compare.length;
	compare.forEach(c => {
    	fetch(dw+dates[range]+'/'+c.name)
        .then(res => res.json())
        .then(json => {
        	datasets.push({
            	label: c.name,
                borderColor: c.color,
                fill: false,
                data: json.downloads.map(d => ({
                	x: new Date(d.day),
                    y: d.downloads
                }))
            });
            last--;
            if (last == 0) {
            	chart.data.datasets = datasets;
                chart.update();
            }
        });
    });
}

const C = _ => compare.length ? z('',
z._p('Downloads in past ',
    z._select.p0({
        value: range,
        oninput(e) {
        	range = e.target.value;
            setData();
        }
    }, Object.keys(dates).map(
        p => z._option({ value: p }, p)))
),
z._canvas.sp1({
	on$created(e) {
    	chart = new Chart(e.target.getContext('2d'), {
        	type: 'line',
        	data: {},
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Date",
                        }
                    }],
                }
            }
        });
        setData();
    }
})
) : '';

const randColor = _ => '#'
	+ Math.floor(Math.random() * 0xffffff)
	.toString(16).padStart(6);

let compare = [], sgs = [], s;
function comparePackage(pkg) {
	if (compare.find(p => p.name === pkg.name)) return;
    pkg.color = randColor();
    compare.push(pkg)
    fetch(pkgURL + pkg.name)
    .then(res => res.json())
    .then(json => {
        pkg.github = json.collected.github;
        z.update();
    });
    setData();
}

const Search = z.m(
    z._input.p0.br({
        value: _ => s, type: 'text', name: 'search',
        class: _ => ({ focused: s }),
        placeholder: 'Enter an npm package...',
        oninput(e) {
            s = e.target.value;
			if (!s.trim()) {
            	sgs = [];
                z.update();
            	return;
            }
            z.update();
            fetch(sgURL + encodeURI(s))
            .then(res => res.json())
            .then(json => {
                sgs = json;
                z.update();
            });
        },
    }),
    _ => sgs.length ? z.sp1(sgs.map(
    	sg => z.p0.sg.cp.br({
        	onclick(e) {
                sgs = [];
                s = '';
                comparePackage(sg.package);
                z.update();
            }
        },
        	z._b(sg.package.name),
            z.v(sg.package.description)
        )
    )) : '',
    _ => compare.length ? z.g.wrap(compare.map(
    	p => z.b0.p0.br.sp1({
        	style: `border-color: ${p.color}`
        }, z.g.ac(
            z.v(p.name), z.cp({
                onclick(e) {
                    compare.splice(compare.indexOf(p), 1);
                   	setData();
                    z.update();
                }
            }, '×'))
        )
    )) : ''
);


const Table = _ => compare.length
	? z._table.sp1(
    	z._tr(['', 'stars', 'forks',
        	'issues', 'updated', 'size'].map(
            t => z._th(t)
        )),
        compare.map(c => z._tr(
        	z._td(z._a({ href: c.links.npm }, c.name)),
            c.github ? [
                z._td(c.github.starsCount),
                z._td(c.github.forksCount),
                z._td(c.github.issues.count)
            ] : [z._td(),z._td(),z._td()],
            z._td(c.date.slice(0, 10)),
            z._td(
            	z._a({ href: bp + c.name },
                	z._img({src:mz+c.name})
           	))
        ))
    )
    : '';

const Info = z._p(
	"The npm package download data comes from npm's ",
    z._a({
    	href: 'https://github.com/npm/download-counts'
    }, 'download counts'),
    ' api and package details come from ',
    z._a({ href: 'npms.io' }, 'npms.io')
);

const Body = z.m(
	z._h1('Compare package download counts over time'),
    Search,
	C,
    Table,
    Info
);
z.setBody(Body);
// file: style.css
body { font-family: sans-serif; }
.br { border-radius: 4px; }
.b0 { border: 2px solid; }
input { width: 100%; border: 2px solid #ddd;
	 outline: none; }
input.focused  { border-color: #8bc34a; }
.sp1 { margin-top: 15px; }
a { text-decoration: none; color: #8bc34a; }
a:hover { text-decoration: underline; }
.p0 { padding: 5px 10px; }
.cp { cursor: pointer; }
.sg:hover { background: #eee; }
.g { display: flex; }
.g { margin-left: -1rem; }
.g > * { margin-left: 1rem; }
.g > .g { margin-left: 0; }
.g.wrap { flex-wrap: wrap; }
.g.ac { align-items: center; }
.ws { white-space: pre; }
td { padding: 5px 10px; }
select { border: 0; border-bottom: 1px solid;
	background: 0; outline: 0; }
```

# Drum machine
``` demo
// file: beats.js
const bpm = 120, ticks = 8;
const interval = 1 / (4 * bpm / (60 * 1000));

const prefix = 'https://freesound.org/data/previews/';
const sounds = [
	'344/344759_1676145-lq.mp3',
    '181/181321_1407525-lq.mp3',
    '183/183103_2394245-lq.mp3',
    '207/207957_19852-lq.mp3'
].map(s => prefix + s);

// preload sounds
sounds.forEach(s => new Audio(s));

export const beats = new Array(sounds.length);
for (let i = 0; i < beats.length; i++)
    beats[i] = new Array(ticks).fill(0);

export const e = new Set();
export let tick = 0;

let prevTime = new Date().getTime();
    
(function drumLoop() {
	const time = new Date().getTime();
	const dt = time - prevTime;
    if (dt >= interval) {
    	for (let i = 0; i < sounds.length; i++)
            if (beats[i][tick])
                new Audio(sounds[i]).play();
        e.forEach(f=>f());
        tick = ++tick % ticks;
        prevTime = time;
    }
    requestAnimationFrame(drumLoop);
})();
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';
import { tick, beats, e } from './beats.js';

e.add(z.update);

const Beat = (b, i, row) => z.c({
	class: { b, h: tick == i },
    onclick(e) { row[i] = !row[i]; }
});

const Beats = _ => beats.map(row => z.g(row.map(Beat)));

const Body = z.g.cr(z.m(Beats));
z.setBody(Body);
// file: style.css
body { background: black; }
.g { display: flex; }
.g.cr { align-items: center; justify-content: center;
	height: 100%; width: 100%; }
.c { border: 10px solid #fff; cursor: pointer;
	padding: 10px; margin: 10px; }
.h { background: #fff; }
.b { background: red; border-color: red; }
```

# Pizza delivery
``` demo
// file: pizzas.js
// data is taken from https://dodopizza.com
// please don't drag me to courts
export default [{"name":"Cheese","description":"Mozzarella, marinara sauce, and basil","sizes":[{"price":9,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/23d59d56-0302-491d-a35a-322f35289b90.jpg"},{"price":11,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/e6033ed4-8e5f-44c0-91de-96ccf0b5eeee.jpg"},{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/e6033ed4-8e5f-44c0-91de-96ccf0b5eeee.jpg"}]},{"name":"Pepperoni","description":"Double pepperoni, mozzarella, marinara sauce, and basil","sizes":[{"price":11,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/ca783766-80af-473a-a45d-04d3c04dfca7.jpg"},{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/898e15a4-44ae-4d81-9e99-0993266583b1.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/898e15a4-44ae-4d81-9e99-0993266583b1.jpg"}]},{"name":"Sausage","description":"Double Italian sausage, mozzarella, parmesan, marinara sauce and basi","sizes":[{"price":11,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/940e2c94-7d5e-4245-8775-32837d7c241a.jpg"},{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/b90c5a25-8d2c-4a5a-9403-47f27862ad05.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/b90c5a25-8d2c-4a5a-9403-47f27862ad05.jpg"}]},{"name":"Supreme","description":"Marinara sauce, pepperoni, basil, mozzarella, italian sausage, bacon, mushrooms, red onions, black olives, and green peppers","sizes":[{"price":13.5,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/80f34f72-c34d-4130-be88-346785db378d.jpg"},{"price":16,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/c834f736-6aae-4cfe-aafb-03b0fe66808f.jpg"},{"price":18,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/c834f736-6aae-4cfe-aafb-03b0fe66808f.jpg"}]},{"name":"The Meats","description":"Pepperoni, ham, italian sausage, mozzarella, bacon, marinara sauce, and basil","sizes":[{"price":13.5,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/3d1ad2f2-0021-4fa1-a509-6f5230351387.jpg"},{"price":16,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/91e5f5a1-73e2-49b5-934e-2df96710624a.jpg"},{"price":18,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/91e5f5a1-73e2-49b5-934e-2df96710624a.jpg"}]},{"name":"Buffalo Chicken","description":"Chicken, buffalo sauce, mozzarella, cheddar, parmesan and red onions","sizes":[{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/4470bdf1-4d42-42c1-b1e3-8c029cd03220.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/09b1de95-60bc-43f3-9b85-d5db91739fc3.jpg"},{"price":17,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/09b1de95-60bc-43f3-9b85-d5db91739fc3.jpg"}]},{"name":"Chicken BBQ","description":"Chicken, bbq sauce, bacon, mozzarella, basil, and red onions","sizes":[{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/6b3178b8-ac3e-4a63-80ed-61d20f0e1e73.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/5972d4b0-d37c-443f-9e44-aa8fb3e5aa06.jpg"},{"price":17,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/5972d4b0-d37c-443f-9e44-aa8fb3e5aa06.jpg"}]},{"name":"Chicken Club","description":"Chicken, cherry tomatoes, ricotta, parsley, mozzarella, bacon, and red onions","sizes":[{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/fa040aaa-5a65-491a-a76f-023ac99aa00a.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/bcb198e7-81e5-4e8d-85d4-6cd01684585f.jpg"},{"price":17,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/bcb198e7-81e5-4e8d-85d4-6cd01684585f.jpg"}]},{"name":"Hawaiian","description":"Ham, fresh pineapple, mozzarella, marinara sauce, and basil","sizes":[{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/c1b27332-c1a5-459e-8c9e-f5bd8ff3d2a6.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/7adbb5f4-e8e9-48ed-970f-6ece06d20b42.jpg"},{"price":17,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/7adbb5f4-e8e9-48ed-970f-6ece06d20b42.jpg"}]},{"name":"Spinach Feta ","description":"Fresh spinach, feta, ricotta, mozzarella, parsley, and red onions","sizes":[{"price":11,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/3dfc4e79-ed13-431c-a1f0-cb8a318686c3.jpg"},{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/2a694140-d6c5-4379-92dc-8984d9b97bb7.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/2a694140-d6c5-4379-92dc-8984d9b97bb7.jpg"}]},{"name":"Veggie","description":"Green peppers, cherry tomatoes, mozzarella, ricotta, parsley, mushrooms, black olives, and red onions","sizes":[{"price":13,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/8be586f9-c2ca-4163-bbed-922443791f39.jpg"},{"price":15,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/f603b3bf-99ac-46f7-80ed-b1a1131528c2.jpg"},{"price":17,"photo":"https://eu2dodostatic.blob.core.windows.net/usa/Img/Products/Pizza/en-US/f603b3bf-99ac-46f7-80ed-b1a1131528c2.jpg"}]}]
// file: style.css
html { font-family: sans-serif; }
body { padding: 45px 30px; }
.g { display: flex; }
.g.wrap { flex-wrap: wrap; }
.g.col { flex-direction: column; }
.s1 { flex: 1; }
.ac { align-items: center; }
.jc { justify-content: center; }
.h { height: 100%; }
.w { width: 100%; }
.w0 { max-width: 200px; }
.w1 { max-width: 640px; }
.sp0 { margin-top: 0px; }
.sp1 { margin-top: 15px; }
.sp2 { margin-top: 30px; }
.spl { margin-left: 15px; }
.spl2 { margin-left: 30px; }
.spl3 { margin-left: 45px; }
a { color: black; text-decoration: none; position: relative;
    overflow: hidden; padding: 5px; }
a:after { content: ''; border-bottom: 1px solid; bottom: 0px;
    width: 0px; left: 0; position: absolute; transition: width .2s; }
a:hover:after { width: 100%; }
button { background: 0; padding: 5px; border: 1px solid; cursor: pointer;
    outline: none; border-radius: 2px; user-select: none; }
button:hover { padding: 4px; border: 2px solid; }
.b { border: 1px solid; border-radius: 2px; margin: -1px; }
.cp { cursor: pointer; }
.title { font-size: 12px; margin-bottom: 5px;
    text-transform: uppercase; color: #444; }
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';

import pizzas from './pizzas.js';
pizzas.forEach(i => i.size = 0);

const lost = z.g.h.w.ac.jc(z.v(
    z._h1('It seems you get lost.'),
    z.g.jc(z._a({ href: '#' }, 'Order pizza'))
    // and our delivery will find you
));

const Adder = size => z.v.g.ac.wrap.row(
    z._button({
        onclick(e) {
            size.count--;
            z.update();
        }
    }, '-'),
    z.v.spl(size.count),
    z._button.spl({
        onclick(e) {
            size.count++;
            z.update();
        }
    }, '+'),
);

const sizes = ["10''", "12''", "14''"];

const price = n => '$' + n.toFixed(2);

const Pizza = pizza => z.w0.sp2.g.col.spl3(
    z.v(
        z._img({src: pizza.sizes[pizza.size].photo, width: '100%'}),
        z._h2(pizza.name),
        z._p(pizza.description)
    ), z.s1(),
    z.v(
        z.g(sizes.map((t, j) => z.s1.cp.g.jc({
            class: { b: pizza.size == j },
            onclick(e) { pizza.size = j; z.update(); }
        }, sizes[j]))),
        z.g.ac.sp1(
            z._b(price(pizza.sizes[pizza.size].price)),
            z.s1.spl(),
            pizza.sizes[pizza.size].count
                ? Adder(pizza.sizes[pizza.size])
                : z._button({
                onclick(e) {
                        pizza.sizes[pizza.size].count = 1;
                        z.update();
                    }
                }, 'Add to busket')
        )
    )
);

const Menu = z.m(
    z._a({ href: '#basket' }, 'Busket'),
    _ => z.g.wrap.row.jc(pizzas.map(Pizza))
);

const BasketItem = (pizza, size, si) => z.sp2.g(
    z._img({src: size.photo, height: '100px'}),
    z.g.ac.spl.row.s1(
        z.v.spl(
            z.title('Name'),
            z._h2.sp0(pizza.name + ' ' + sizes[si]),
            z.title('Price'),
            z._span(size.count, ' * ', price(size.price), ' = '),
            z._b(price(size.count * size.price))),
        z.s1.spl2(),
        Adder(size),
        z._button.spl({
            onclick(e) {
                size.count = 0;
                z.update();
            }
        }, 'remove'))
);

const EmptyBusket = z.g.h.w.ac.jc(z.v(
    z._h1('Basket is empty'),
    z.g.jc(z._a({ href: '#' }, 'Back to menu'))
));

function Basket() {
    const busket = [];
    let sum = 0;
    pizzas.forEach(p => {
        p.sizes.forEach((s, i) => {
            if (s.count) {
                busket.push(BasketItem(p, s, i));
                sum += s.count * s.price;
            }
        });
    });
    if (busket.length == 0) return EmptyBusket;
    return z.g.jc(
        z.w1(busket,
            z.g.sp2.row(z.s1(), z._span('Total: '), z._b(price(sum))),
            z.g.sp1(z._a({ href: '#' }, 'Back to menu'),
                z.s1(),
                z._button('Order')))
    );
}

const Body = z('', _ => {
    const { route, args } = z.route();
    if (route === '') return Menu;
    else if (route === 'basket') return Basket;
    return lost;
});
z.setBody(Body);
```

# SVG path builder

``` demo
// file: index.js
import z from 'https://blackmius.ru/shared/zombular.js';
const Style = z._style(``);
const Body = z('', Style);
z.setBody(Body);
```
