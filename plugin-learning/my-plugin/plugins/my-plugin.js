module.exports = class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    console.log('my plugin run.');
    console.log(this.options);
  }
}