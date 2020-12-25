const { file } = require('jszip');
const JSZip = require('jszip');
const path = require('path');
const RawSource = require('webpack-sources').RawSource;
const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      const folder = zip.folder(this.options.filename); // 创建压缩包, this.options.filename为压缩包名称

      for(let filename in compilation.assets) {   // 此时默认为ouput中设置的main.js
        let source = compilation.assets[filename].source();
        
        folder.file(filename, source);
      }

      zip.generateAsync({
        type:"nodeBuffer"
      }).then((content) => {
        const outputPath = path.join(compilation.options.output.path, this.options.filename + '.zip');
        const outputRelativePath = path.relative(compilation.options.output.path, outputPath);
        compilation.assets[outputRelativePath] = new RawSource(content);

        callback();
      });
    })
  }
}