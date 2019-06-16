import { z, page, each } from './2ombular';
import { register } from './page';

let articles = [];
let tags = {};

fetch('./data.json')
.then(res => res.json())
.then(json => {
    articles = json;
    articles.forEach(a => {
        a.tags.forEach(t => {
            if (!tags[t]) tags[t] = [];
            tags[t].push(a)
        })
    })
    page.update();
});

function Article({name, date, slug, tags}) {
    return z.ib.mw0.sp2(
        z.f1.c1(date),
        z._a({href: page.link('article', {slug})}, name),
        z.g(tags.map(tag => z._a.sp1.b1.c2.h.bn.br0.p0.f0.cp({
            href: page.link('tag', { name: tag })
        }, tag))),
    );
}

register('tag', _ => z.main(
    _ => z('',
        z._h1(`Tag «${page.args.name}»`),
        z._a({ href: page.link('', {}) }, 'Articles list'),
        z.v(),
        tags[page.args.name]
            ? tags[page.args.name].map(Article)
            : z._h2('No articles, come back later')
    )
));

register('', _ => z.main(
    z._h1('Articles'),
    _ => articles.length
        ? articles.map(Article)
        : z._h2('Wait, im loading...')
));
