const asset = require('assert');
const path = require('path')

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base');
  // console.log(baseConfig);

  const projectRoot = process.cwd();

  it('entry test', () => {
    asset.equal(baseConfig.entry.index, path.resolve(projectRoot, './src/index/index.js'));
    asset.equal(baseConfig.entry.search, path.resolve(projectRoot, './src/search/index.js'));
  })

})