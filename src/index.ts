import http, { Server } from 'http'
import https from 'https'
import { readFileSync } from 'node:fs'
import { ConfigManager } from './utils/configManager.js'
import { Logger } from './utils/logger.js'
import { SymbolWebServer } from './webserver/SymbolWebServer.js'
import { SymbolWebSocketServer } from './websocket/WebSocketServer.js'

/** コンフィグ初期化 */
ConfigManager.init()
const cnfMgr = ConfigManager.getInstance()

/** Webサーバ */
let server: Server
const webServer = new SymbolWebServer()
if (cnfMgr.config.protocol.toUpperCase() === 'HTTPS') {
  server = https.createServer(
    { cert: readFileSync(cnfMgr.config.sslCertificatePath), key: readFileSync(cnfMgr.config.sslKeyPath) },
    webServer.procedure
  )
} else {
  server = http.createServer(webServer.procedure)
}

/** WebSocketサーバ */
const wsServer = new SymbolWebSocketServer()
wsServer.start(server)

/** サーバ開始 */
const logger = new Logger('Rest')
logger.info(`Rest start - Protocol: ${cnfMgr.config.protocol.toUpperCase()}, Port: ${cnfMgr.config.port}`)
server.listen(cnfMgr.config.port)
