const bluebird = require('bluebird');

global.Promise = bluebird;

// @ts-ignore
function promisifier(method) {
  // return a function
// @ts-ignore
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

// @ts-ignore
function promisifyAll(obj, list) {
// @ts-ignore
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
// @ts-ignore
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
]);


promisifyAll(chrome.storage, [
  'local',
]);

require('./background/inject');
require('./background/badge');
