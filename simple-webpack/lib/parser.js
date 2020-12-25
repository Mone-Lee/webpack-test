// 1. 将ES6转换成AST，再转换为ES5
// 2. 分析依赖
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  // 转换成AST
  // path 文件路径
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');

    return babylon.parse(source, {
      sourceType: 'module'
    })
  },

  // 分析依赖
  // 使用babel-traverse对AST进行遍历
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      // 分析import语句
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);   // node.source.value为分析出来的依赖
      }
    })

    return dependencies;
  },

  // 将AST转换成ES5
  // 使用babel-core
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']  // 2015，2016，2017的语法也可以解析
    })

    return code;
  }
}
