module.exports = class Compiler {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']),
      break: new SyncHook(),
      caculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    }
  }

  run() {
    this.accelerate(10);
    this.break();
    this.caculateRoutes('Async', 'hook', 'demo');
  }

  accelerate(speed) {
    this.hooks.accelerate.call(speed);
  }

  break() {
    this.hooks.accelerate.break();
  }

  caculateRoutes() {
    this.hooks.caculateRoutes.promise(...arguments).then(() => {
    }, err => {
      console.error(err)
    })
  }
}