const loaderUtils = require('loader-utils');
const { loader } = require('mini-css-extract-plugin');
const fs = require('fs');
const path = require('path');

module.exports = function(source) {
  const { name } = loaderUtils.getOptions(this);

  this.cacheable(false);
  const callback = this.async();
  const json = JSON.stringify(source)
                .replace('foo', name)
                .replace(/\u2028/g, '\\u2028')
                .replace(/\u2029/g, '\\u2029')
  

  fs.readFile(path.join(__dirname, './async.txt'), 'utf-8' , (err, data) => {
    if (err) {
      callback(err, '');
    }
    callback(null, data);
  })

  // throw new Error('error throw');
  // return `export default ${json}`;
  // this.callback(null, json, 2, 3, 4);
}