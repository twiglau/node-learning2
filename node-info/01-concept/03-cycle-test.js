const fs = require('fs');

setTimeout(() => {// 新的事件循环的起点
  console.log('1');
  fs.readFile('./test.conf', { encoding: 'utf-8' }, (err,data) => {
    if(err) throw err;
    console.log('read file sync success => 1');
  });
}, 0);

// 回调将会在新的事件循环之前
fs.readFile('./test.conf', { encoding: 'utf-8' }, (err,data) => {
  if(err) throw err;
  console.log('read file sync success')
});