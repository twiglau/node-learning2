
/**
 * 主线程会因为 回调函数的执行 而被阻塞
 * 如果将 setTimeout 的时间修改为 10ms, 将优先看到 fs.readFile 的回调函数，
 * 因为 fs.readFile 执行完成了， 并且还未启动下一个事件循环。
 */
const fs = require('fs');

setTimeout(() => { // 新的事件循环的起点
   console.log('1');
   sleep(10000);
   console.log('sleep 10s');
}, 0);

// 将会在新的事件循环中的 pending callbacks 阶段执行 
fs.readFile('./test.conf', { encoding: 'utf-8' }, (err, data) => {
  if(err) throw err;

  console.log('read file success');
});

console.log('2');


// 函数实现，参数 n 单位 毫秒；
function sleep(n) {
  var start = new Date().getTime();
  while(true) {
    if(new Date().getTime() - start > n) {
      // 使用 break 实现；
      break;
    }
  }
}