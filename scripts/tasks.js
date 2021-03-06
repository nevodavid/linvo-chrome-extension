require('shelljs/global');
const fs = require('fs');

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

exports.copyAssets = (type) => {
  const env = type === 'build/chrome_extension' ? 'prod' : 'dev';
  rm('-rf', type);
  fs.mkdirSync(type, { recursive: true });
  cp(`chrome_extension/chrome/manifest.${env}.json`, `${type}/manifest.json`);
  cp('-R', 'chrome_extension/chrome/assets/*', type);
  exec(`pug -O "{ env: '${env}' }" -o ${type} chrome_extension/chrome/views/`);
};
