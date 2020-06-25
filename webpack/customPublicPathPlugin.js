/* global __webpack_public_path__ __HOST__ __PORT__ */
/* eslint no-global-assign: 0 camelcase: 0 */

const path = process.env.NODE_ENV === 'production' ? `//${__HOST__}/plugin/js` : `//${__HOST__}:${__PORT__}/js/`;
if (location.protocol === 'https:' || location.search.indexOf('protocol=https') !== -1) {
  __webpack_public_path__ = `https:${path}`;
} else {
  __webpack_public_path__ = `http:${path}`;
}
