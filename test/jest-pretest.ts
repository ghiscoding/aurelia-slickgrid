import 'aurelia-polyfills';
import 'isomorphic-fetch';
import 'jsdom-global/register';
import { globalize } from 'aurelia-pal-nodejs';
import Sortable from 'sortablejs';
globalize();

// import jQuery AFTER globalize() is the only way to get the test working
import * as jQuery from 'jquery';

(global as any).$ = (global as any).jQuery = jQuery;
(window as any).$ = (window as any).jQuery = jQuery;
(global as any).navigator = { userAgent: 'node.js' };
(global as any).Slick = (window as any).Slick = {};
(global as any).Sortable = (window as any).Sortable = Sortable;

require('slickgrid/slick.core');
require('slickgrid/slick.dataview');
require('slickgrid/slick.interactions');
require('slickgrid/slick.grid');
