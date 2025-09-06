
const fs = require('fs');
// 首次事件循环执行
console.log('start');

// 将会在新的事件循环中的阶段执行
fs.readFile('./test.conf', { encoding: 'utf-8'}, (err, data) => {
  if(err) throw err;

  console.log('read File success');
});

setTimeout(() => {
  // 新的事件循环的起点
  console.log('setTimeout');
}, 0);