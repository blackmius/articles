import { z, each, page } from './2ombular';
import { register } from './page';
import markdown from './markdown';
import smoothscroll from './smoothscroll';

let error, content, anchors = [];

const notFound = z._h1.slide("Sorry, i haven't written such an article yet 🤔");

function sticky(e) {
    window.onscroll = function() {
        if (e.target.offsetHeight > window.innerHeight) {
            if (window.pageYOffset + window.innerHeight - 95 >= e.target.offsetHeight) {
                e.target.classList.add("sticky", "tall")
            } else {
                e.target.classList.remove("sticky", "tall");
            }
        } else {
            e.target.classList.add("sticky")
        }
    }
}

function Anchor({id, title, level}) {
    return z._a({
        class: level > 1 ? 'spl' + (level-1) : '',
        onclick: _ => smoothscroll(id)
    }, title);
}

const Tmpl = _ => error
    ? notFound
    : z.main.page(
    anchors.length > 0
        ? z.anchors({ on$created: sticky },
            each(anchors, Anchor, z.sp1()),
            z.sp2(), z._a({ href: '#' }, 'Articles list'))
        : '',
    content ? z('<', content) : ''
);

let ll, c;

function load(name) {
    if (ll === name) return;
    ll = name;
    fetch(`./pages/${name}.md`)
    .then(res => {
        if (res.status === 404) {
            error = notFound;
            return;
        }
        error = null;
        return res.text();
    })
    .then(text => {
        const md = markdown();
        content = md.render(text);
        anchors = md.toc;
        c = Tmpl();
        return page.update();
    })
}

register('article', _ => _ => {
    load(page.args.slug || '');
    return c;
});
