import 'aurelia-polyfills';
import { Options } from 'aurelia-loader-nodejs';
import { globalize } from 'aurelia-pal-nodejs';
import * as path from 'path';
import * as jQuery from 'jquery';

Options.relativeToDir = path.join(__dirname, 'unit');
globalize();
(global as any).Storage = window.localStorage;
declare var window: any;
declare var global: any;
window.$ = window.jQuery = jQuery;
global.$ = global.jQuery = jQuery;
