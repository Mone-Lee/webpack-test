// 单元测试入口文件
const path = require('path');

// 因为测试项目模板在smoke/template目录下，要修改下运行目录
process.chdir(path.join(__dirname, 'smoke/template'));

describe('webpack-project-builder test case', () => {
  require('./unit/webpack-base-test');
})