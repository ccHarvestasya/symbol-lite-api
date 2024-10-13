import { createServer } from 'http'
import { SymbolWebSocketServer } from '../src/SymbolWebSocketServer.js'

/** HTTPサーバ */
const webServer = createServer(async (request, response) => {
  console.log(request)
  console.log(response)
})

/** WebSocketサーバ */
const wsServer = new SymbolWebSocketServer()
wsServer.start(webServer)

/** サーバ開始 */
webServer.listen(3000)
