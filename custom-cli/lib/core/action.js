const inquirer = require('inquirer');

const myAction = (project,args) => {
  // 命令行的执行 逻辑代码
  inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      choices: ['express', 'koa', 'egg'],
      message: '请选择你所使用的框架？'
    }
  ]).then(answer => {
    console.log(answer)
  })
}

module.exports = myAction