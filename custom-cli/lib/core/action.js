const {select} = require('@inquirer/prompts');
const download = require('download-git-repo');
const config = require('../../config');
const downloadFun = require('./download');

const myAction = async (project,args) => {
  // 命令行的执行 逻辑代码
  const answer = await  select({
    name: 'framework',
    choices: config.framework,
    message: '请选择你所使用的框架？'
  })
  // 下载代码
  downloadFun(config.frameworkUrl[answer], project)
}

module.exports = myAction