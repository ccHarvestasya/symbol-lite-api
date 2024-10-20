import log4js from 'log4js'
import { ConfigManager } from './configManager.js'

export class Logger {
  private logger_

  constructor(category?: string) {
    const cnfMgr = ConfigManager.getInstance()
    log4js.configure({
      appenders: {
        file: {
          daysToKeep: 90,
          filename: `logs/${cnfMgr.config.logging.file.filename}`,
          keepFileExt: true,
          layout: { type: 'pattern', pattern: '[%d] [%-5p] %-10c %m' },
          pattern: 'yyyyMMdd',
          type: 'file',
          level: cnfMgr.config.logging.file.level,
        },
        console: { type: 'stdout', level: cnfMgr.config.logging.console.level },
      },
      categories: {
        default: { appenders: ['console'], level: 'all' },
        Rest: { appenders: ['file', 'console'], level: 'all' },
        Socket: { appenders: ['file', 'console'], level: 'all' },
        WebSocket: { appenders: ['file', 'console'], level: 'all' },
      },
    })
    this.logger_ = log4js.getLogger(category)
  }

  debug(msg: string) {
    this.logger_.debug(msg)
  }

  error(msg: string) {
    this.logger_.error(msg)
  }

  fatal(msg: string) {
    this.logger_.fatal(msg)
  }

  info(msg: string) {
    this.logger_.info(msg)
  }

  trace(msg: string) {
    this.logger_.trace(msg)
  }

  warn(msg: string) {
    this.logger_.warn(msg)
  }

  shutdown(exitCode: number | undefined) {
    process.exitCode = exitCode
    log4js.shutdown(() => {
      process.on('exit', () => {
        throw new Error(`process.exit(${exitCode})`)
      })
    })
  }
}
