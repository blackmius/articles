import { z, page, each } from './2ombular';
import Page from './page';

import './style.css';

import './main';
import './article';

const Body = z('', Page);
page.setBody(Body);
