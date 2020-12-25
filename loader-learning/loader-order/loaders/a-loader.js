const loaderUtils = require('loader-utils');

module.exports = function(source) {
  console.log('a-loader run');
  const url = loaderUtils.interpolateName(this, '[name].[ext]', {});

  this.emitFile(url, source);
  return source;
}