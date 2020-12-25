// 入口文件
const Compiler = require('./compiler');
const options = require('../simpleWebpack.config');

new Compiler(options).run();