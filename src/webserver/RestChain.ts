import { IncomingMessage, ServerResponse } from 'node:http'
import { Catapult } from '../catapult/Catapult.js'
import { Logger } from '../utils/logger.js'
import { RestBase } from './RestBase.js'

export class RestChain extends RestBase {
  protected async responseGet(
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    catapult: Catapult
  ) {
    const logger = new Logger('Rest')
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

    switch (request.url) {
      case '/chain/info': {
        logger.info(`${ip} 200 ${request.url}`)
        const result = await catapult.getChainInfo()
        if (result === undefined) throw new Error('Internal Server Error')
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(result))
        break
      }

      default: {
        // 処理無し
        break
      }
    }
  }

  protected async responsePost(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ) {}

  protected async responsePut(
    _request: IncomingMessage,
    _response: ServerResponse<IncomingMessage> & { req: IncomingMessage },
    _catapult: Catapult
  ) {}
  // end
}
