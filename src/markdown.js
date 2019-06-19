import { page } from './2ombular';

import Remarkable from 'remarkable';
import slugify from 'slugify';

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('demo', javascript);
import 'highlight.js/styles/nord.css';

window.addEventListener("message", ({data}) => {
    if (data.slice && data.slice(0, 6) === 'resize') {
        let [cmd, name, height] = data.split(',');
        document.querySelector(`iframe[name="${name}"]`).height = height;
    }
})

function highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(lang, str).value;
        } catch (err) {}
    }

    try {
        return hljs.highlightAuto(str).value;
    } catch (err) {}

    return '';
}

const embeded = 'https://blackmius.ru/playground'//'http://localhost:8080';

function p(remarkable) {
    remarkable.toc = [];
    remarkable.renderer.rules.heading_open = function(tokens, idx) {
        let level = tokens[idx].hLevel,
            title = tokens[idx + 1].content,
            id = slugify(title);
        remarkable.toc.push({level, title, id});
        return `<h${level} id=${id}>`;
    };
    let fid=0;
    remarkable.renderer.rules.fence = function(tokens, idx) {
        const content = tokens[idx].content.trim(),
              lang = tokens[idx].params;
        if (lang === 'demo') {
            return `<iframe name="${++fid}" src="${embeded}/#;name=${fid};theme=nord;embeded=true;data=${btoa(content)}"></iframe>`;
        }
        const code = highlight(content, lang);
        return '<pre><code class="hljs javascript"><table><tbody>'
            + code.split('\n').map((a, i) => `<tr><td class="hljs-ln">${i+1}</td><td>${a}</td></tr>`).join('')
            + '</tbody></table></code></pre>';
    }
}

export default _ => new Remarkable().use(p);
