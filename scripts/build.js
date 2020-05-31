const tasks = require('./tasks');

tasks.replaceWebpack();
console.log('[Copy assets]');
console.log('-'.repeat(80));
tasks.copyAssets('build/chrome_extension');

console.log('[Webpack Build]');
console.log('-'.repeat(80));
exec('webpack --config webpack/prod.config.js --progress --profile --colors');
exec('webpack --config webpack/plugin_prod.config.js --progress --profile --colors');
