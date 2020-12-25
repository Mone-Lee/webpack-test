const { SyncHook, AsyncSeriesHook } = require('tapable');
const { resolve } = require('../webpack.prod');

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']),
      break: new SyncHook(),
      caculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    }
  }
}

const myCar = new Car();

myCar.hooks.accelerate.tap('LoggerPlugin', newSpeed => {
  console.log(`Accelerating to ${newSpeed}`)
})

myCar.hooks.break.tap('WarningLampPlugin', () => {
  console.log('WarningLampPlugin')
})

myCar.hooks.caculateRoutes.tapPromise('calculateRoutes tapPromise', (source, target, routesList, callback) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`tapPromise to ${source} ${target} ${routesList}`)
      resolve()
    }, 1000)
  })
})

myCar.hooks.brake.call();
myCar.hooks.accelerate.call(10);

console.time('cost');

myCar.hooks.caculateRoutes.promise('Async', 'hook', 'demo').then(() => {
  console.timeEnd('cost');
}, err => {
  console.error(err);
  console.timeEnd('cost');
})