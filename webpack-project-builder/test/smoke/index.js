const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
})

process.chdir(path.join(__dirname, 'template'));  // 设置运行目录为 template目录 projectRoot

// 冒烟测试，检查是否能正常打包构建
rimraf('./dist', () => {
  const prodConfig = require('../../lib/webpack.prod');

  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false
    }));

    // 检查是否正常构建，输出html, js, css文件
    console.log('webpack build success, start to run test');
    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'js-css-test.js'));
    mocha.run();
  })
})
