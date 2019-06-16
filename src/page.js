import { z, page } from './2ombular';

const pages = {};
let content, lastRoute;

export function register(name, f) {
    pages[name] = f;
    page.update();
}

const notFound = z._h1.slide("You wandered off into nowhere");

export default _ => {
    if (page.route !== lastRoute) {
        if (pages[page.route]) {
            lastRoute = page.route;
            if (pages[page.route])
                content = pages[page.route]();
        } else {
            return notFound;
        }
    }
    return content;
}
