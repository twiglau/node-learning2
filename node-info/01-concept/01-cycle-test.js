const fs = require('fs');

console.log('0', new Date().valueOf())
setTimeout(() => { // 新的事件循环的起点
  console.log('1', new Date().valueOf());
}, 0);

setImmediate(() => {
  console.log('setImmediate 1', new Date().valueOf());
});

// 将会在新的事件循环中的 pending callbacks 阶段执行
fs.readFile('./test.conf', { encoding: 'utf-8'} , (error, data)=> {
  if(error) throw error;

  console.log('read File success', new Date().valueOf());
})

// 该部分将会在首次事件循环中执行
Promise.resolve().then(() => {
  console.log('poll callback', new Date().valueOf());
});

// 首次事件循环执行
console.log('2', new Date().valueOf());

/**
 * 输出：
 * timer 1757140146095
 * 2 1757140146106
 * poll callback 1757140146106
 * 1 1757140146107
 * setImmediate 1 1757140146107
 * read File success 1757140146107
 * 
 * 1. 为什么会先输出2，然后输出1，不是说 timer 的回调函数是运行起点吗？
 * > 当Node.js启动后， 初始化事件循环，处理已提供的输入脚本，它可能会先
 * 调用一些异步的API, 调度定时器或process.nextTick(), 然后再开始处理事件循环。
 * 
 * 
 * 1. setTimeout 如果不设置时间或者设置时间0，则会默认为 1ms
 * 2. 主流程执行完成后，超过 1ms 时，会将 setTimeout 回调函数逻辑
 * 插入到 待执行回调函数 poll 队列中。
 * 3. 当前 poll 队列存在可执行 回调函数，需先执行完待完全执行完成后，
 * 才会执行 check: setImmediate
 */