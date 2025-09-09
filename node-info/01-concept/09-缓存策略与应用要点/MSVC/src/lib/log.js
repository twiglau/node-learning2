
const fsPromise = require('fs').promises;
const fs = require('fs');
const path = require('path')

const logFilePath = path.resolve(__dirname, '../../log')
const fileStreams = {};
const cacheLogStr = {};

/**
 * 日志模块
 */
class Log {

  /**
   * 
   * @param {*} cacheEnable 是否打开日志 缓存模式，默认打开
   * @param {*} cacheTime 缓存处理时间，默认 2 秒，会定时写入文件
   * @param {*} maxLen maxLen 单个日志文件，最大缓存长度，默认 100_000
   * @param {*} maxFileStream 最大缓存文件句柄数， 默认是 10_000
   */
  constructor(cacheEnable=true, cacheTime=2000,maxLen=100000,maxFileStream=1000) {
    this.cacheTime = cacheTime;
    this.cacheEnable = cacheEnable;
    this.maxLen = maxLen;
    this.maxFileStream = maxFileStream;
    this.currentFileStreamNum = 0;
  }

  /**
   * @description 启动日志 定时写入
   */
  start() {
    this._intervalWrite();
  }

  /**
   * @description 写入日志
   * @param {*} fileType 日志模块
   * @param {*} logInfo 日志信息
   * @returns 
   */
  info(fileType, logInfo) {
    if(!fileType || !logInfo) {
      return;
    }
    
    this._flush(fileType, logInfo);
  }

  /**
   * @description 定时写入文件
   */
  _intervalWrite() {
    setInterval(() => { // 定时逻辑
      if(Object.keys(cacheLogStr).length < 1) {
        // 空数据，不处理
        return;
      }
      for(let fileType in cacheLogStr) {
        // 遍历需要写入的日志信息
        if(cacheLogStr[fileType] == '') {
          // 空数据，需要清理 句柄
          this._clean(fileType).then();
          continue;
        }
        //写入日志，写入完成后，需要清理当前的日志缓存。
        //注意：这里可能会导致日志丢失
        this._addLog(fileType, cacheLogStr[fileType]).then(() => {
          cacheLogStr[fileType] = '';
        });
      }

    }, this.cacheTime);
  }

  /**
   * @description 根据缓存情况，判断是否 将日志写入文件，还是写入缓存
   * @param {*} fileType 日志模块
   * @param {*} logInfo 日志信息
   * @returns 
   */
  _flush(fileType, logInfo) {
    if(!fileType) {
      // 数据校验
      return;
    }
    let logStr = logInfo;
    if(typeof(logInfo) == 'object') {
      logStr = JSON.stringify(logInfo);
    }
    if(logStr == '' || !logStr) {
      // 数据校验
      return;
    }

    if(!this.cacheEnable) {
      // 如果缓存关闭，直接写日志
      return this._addLog(fileType, cacheLogStr[fileType]);
    }
    if(!cacheLogStr[fileType]) {
      // 判断是否 已经有缓存
      return cacheLogStr[fileType] = `${logStr}`;
    }
    if(cacheLogStr[fileType].length < this.maxLen) {
      // 判断 是否 已经超出缓存最大长度
      return cacheLogStr[fileType] = `${cacheLogStr[fileType]}\n${logStr}}`;
    } else {
      // 如果超出，则直接写入日志
      return this._addLog(fileType, cacheLogStr[fileType]);
    }
  }


  /**
   * @description 将日志信息，根据文件流写入文件
   * @param {*} fileType 日志文件
   * @param {*} data 日志字符串信息
   */
  async _addLog(fileType, data) {
    const fileStream = await this._getFileStream(fileType);
    try {
      fileStream.write(`${data}\n`, 'utf8')
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description 获取日志路径
   * @param {*} fileType 
   * @returns 
   */
  _getFilePath(fileType) {
    return `${logFilePath}/${fileType}.log`
  }

  /**
   * @description 获取文件流 句柄
   * @param {*} fileType 
   */
  async _getFileStream(fileType) {
    if(fileStreams[fileType]) {
      return fileStreams[fileType];
    }
    const filePath = this._getFilePath(fileType);
    console.log('filePath:', filePath);

    await fsPromise.stat(filePath).catch(async err => {
      if(err.code === 'ENOENT') {
        await fsPromise.writeFile(filePath, '');
      }
    });



    const fileStream = fs.createWriteStream(filePath, { encoding: 'utf8', flags: 'a'})

    if(this.currentFileStreamNum < this.maxFileStream) {
      this.currentFileStreamNum++;
      return fileStreams[fileType] = fileStream;
    }

    return fileStream;
  }

  /**
   * @description 清理短期 未使用的句柄和缓存对象， 避免缓存过大，或者未使用文件占用空间
   * @param {*} fileType 
   * @returns 
   */
  async _clean(fileType) {
    let fileStream = await this._getFileStream(fileType);

    delete cacheLogStr[fileType];
    delete fileStreams[fileType];

    this.currentFileStreamNum--;

    if(!fileStream) {
      return;
    }
    fileStream.end();
  }

}

module.exports = Log;