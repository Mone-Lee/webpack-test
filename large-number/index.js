if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/large-number-webpack-build.min.js');
} else {
  module.exports = require('./dist/large-number-webpack-build.js');
}