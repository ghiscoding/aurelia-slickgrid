/*!
 * © 2016 Avira Operations GmbH & Co. KG. All rights reserved.
 * No part of this extension may be reproduced, stored or transmitted in any
 * form, for any reason or by any means, without the prior permission in writing
 * from the copyright owner. The text, layout, and designs presented are
 * protected by the copyright laws of the United States and international
 * treaties.
 */
!function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var d=n[i]={exports:{}};e[i][0].call(d.exports,function(r){var n=e[i][1][r];return o(n||r)},d,d.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(r,e,n){"use strict";!function(r){var e=-1,n=r.addListener.bind(r);r.addListener=function(r){for(var t=arguments.length,o=Array(t>1?t-1:0),u=1;u<t;u++)o[u-1]=arguments[u];n.apply(void 0,[function(n){var t=r(n);return n.requestId===e?null:(t&&null!=t.redirectUrl&&(e=n.requestId),t)}].concat(o))}}(chrome.webRequest.onBeforeRequest)},{}]},{},[1]);