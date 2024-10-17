import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { ConfigManager } from '../utils/configManager.js'
import { Logger } from '../utils/logger.js'
import { RestChain } from './RestChain.js'
import { RestNode } from './RestNode.js'
import { RestTransaction } from './RestTransaction.js'

export class SymbolWebServer {
  private cnfMgr = ConfigManager.getInstance()
  private logger = new Logger('Rest')
  private catapult: Catapult
  constructor() {
    this.catapult = new Catapult(
      this.cnfMgr.config.apiNode.tlsCaCertificatePath,
      this.cnfMgr.config.apiNode.tlsClientCertificatePath,
      this.cnfMgr.config.apiNode.tlsClientKeyPath,
      this.cnfMgr.config.apiNode.host,
      this.cnfMgr.config.apiNode.port,
      this.cnfMgr.config.apiNode.timeout
    )
  }

  private symbolWebServerProcedure = async (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage
    }
  ) => {
    await new RestChain().response(request, response, this.catapult)
    await new RestNode().response(request, response, this.catapult)
    await new RestTransaction().response(request, response, this.catapult)

    if (!response.headersSent) {
      // ヘッダ書き込みなしは404
      const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress
      this.logger.error(`${ip} 404 ${request.url}`)
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.end(`{"code":"ResourceNotFound","message":"${request.url} does not exist"}`)
    }
  }

  get procedure() {
    return this.symbolWebServerProcedure
  }
}
