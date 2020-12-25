// 模块构建与输出
const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');
const { output } = require('../simpleWebpack.config');

module.exports = class Compiler {

  constructor(options) {
    const { entry, output } = options;

    this.entry = entry;
    this.output = output;
    this.modules = [];  // 存储最终构建好的module的信息
  }

  run() {
    const entryModule = this.buildModule(this.entry, true);

    this.modules.push(entryModule);

    this.modules.map((_modules) => {
      _modules.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      })
    })

    this.emitFiles()
  }

  buildModule(filename, isEntry) {
    let ast;

    if (isEntry) {
      ast = getAST(filename); // 入口模块， 路径要求是绝对路径， 不需要转换
    } else {
      // 依赖模块，例：require('./greeting), 相对路径，需要转换
      let absolutePath = path.join(process.cwd(), './src', filename);   // 从根目录，找到src文件夹，再找到对应模块
      ast = getAST(absolutePath);
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }
  }

  // 把文件输出到output配置的路径
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = '';

    this.modules.map((_module) => {
      modules += `'${_module.filename}': function(require, module, exports) { ${_module.source} },`
    })

    const bundle = `(function(modules) {
      function require(filename) {
        var fn = modules[filename];
        var module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('${this.entry}');
    })({${ modules }})`;

    console.log(bundle);

    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}