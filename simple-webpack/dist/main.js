(function(modules) {
      function require(filename) {
        var fn = modules[filename];
        var module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('/Users/lee/Documents/project/webpack-test/simple-webpack/src/index.js');
    })({'/Users/lee/Documents/project/webpack-test/simple-webpack/src/index.js': function(require, module, exports){ "use strict";

var _greeting = require("./greeting.js");

document.write((0, _greeting.greeting)('lee')); },'./greeting.js': function(require, module, exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greeting = greeting;
function greeting(name) {
  return 'hello ' + name;
} },})