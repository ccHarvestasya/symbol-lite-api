import log4js from 'log4js'

const logLevel = 'all'

log4js.configure({
  appenders: {
    rest: {
      daysToKeep: 90,
      filename: 'symbol-lite-api.log',
      keepFileExt: true,
      layout: { type: 'pattern', pattern: '[%d] [%-5p] %-10c %m' },
      pattern: 'yyyyMMdd',
      type: 'file',
    },
    socket: {
      daysToKeep: 90,
      filename: 'symbol-lite-api.log',
      keepFileExt: true,
      layout: { type: 'pattern', pattern: '[%d] [%-5p] %-10c %m' },
      pattern: 'yyyyMMdd',
      type: 'file',
    },
    websocket: {
      daysToKeep: 90,
      filename: 'symbol-lite-api.log',
      keepFileExt: true,
      layout: { type: 'pattern', pattern: '[%d] [%-5p] %-10c %m' },
      pattern: 'yyyyMMdd',
      type: 'file',
    },
    stdout: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['stdout'], level: logLevel },
    rest: { appenders: ['rest', 'stdout'], level: logLevel },
    socket: { appenders: ['socket', 'stdout'], level: logLevel },
    websocket: { appenders: ['websocket', 'stdout'], level: logLevel },
  },
})

export class Logger {
  private logger_

  constructor(category?: string) {
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
