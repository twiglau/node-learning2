module.exports = {
    apps : [{
      name: "nodejs-main-server-3000", // 启动进程名
      script: "./app.js", // 启动文件
      instances: 2, // 启动进程数
      exec_mode: 'cluster', // 多进程多实例
      env_development: {
        NODE_ENV: "development",
        watch: true, // 开发环境使用 true，其他必须设置为 false
        ignore_watch: ["log", "node_modules", "bin", "config"] // 自动重启不需要监听下面目录的变化
      },
      env_testing: {
        NODE_ENV: "testing",
        watch: false, // 开发环境使用 true，其他必须设置为 false
      },
      env_production: {
        NODE_ENV: "production",
        watch: false, // 开发环境使用 true，其他必须设置为 false
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'C:/Users/888/Desktop/nodejs-column-io/err.log', // 错误日志文件，必须设置在项目外的目录，这里为了测试
      out_file: 'C:/Users/888/Desktop/nodejs-column-io/info.log', //  流水日志，包括 console.log 日志，必须设置在项目外的目录，这里为了测试
      max_restarts: 10,

    }
  ]
  }