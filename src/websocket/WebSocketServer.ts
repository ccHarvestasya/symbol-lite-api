import { randomUUID } from 'crypto'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { Logger } from '../utils/logger.js'
import { SymbolZeroMq } from './ZeroMq.js'

export class SymbolWebSocketServer {
  private logger = new Logger('WebSocket')
  private wsClients = new Map<string, WebSocket>()
  private zmqClients = new Map<string, SymbolZeroMq>()

  /**
   * WebSocket開始
   * @param server HTTPサーバ
   */
  start = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    const wss = new WebSocketServer({ server: server })
    /** 接続 */
    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      if (req.url !== '/ws') return
      this.assignClientId(ws)
      /** メッセージ受信 */
      ws.on('message', (msg: RawData) => {
        try {
          const recvData = JSON.parse(msg.toString())
          const zmq = this.zmqClients.get(recvData['uid'])
          if (zmq) {
            if (recvData['subscribe']) zmq.subscribe(recvData['subscribe'])
            else if (recvData['unsubscribe']) zmq.unsubscribe(recvData['unsubscribe'])
            else throw Error('Unknown function.')
          } else {
            throw Error('ZeroMQ instance does not exist.')
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.message) ws.close(1013, err.message)
          else ws.close()
        }
      })
      /** エラー */
      ws.on('error', (err: Error) => {
        if (err && err.message) ws.close(1013, err.message)
        else ws.close()
      })
      /** 閉じる */
      ws.on('close', this.closedWebSocket)
    })
  }

  /**
   * 接続時処理
   * @param ws WebSocket
   */
  private assignClientId = (ws: WebSocket): void => {
    // UUID取得
    const uuid = randomUUID().replaceAll('-', '').toUpperCase()
    this.logger.debug(`{"uid": "${uuid}"}`)
    this.wsClients.set(uuid, ws)
    // ZeroMQ開始
    const zeroMq = new SymbolZeroMq(ws)
    zeroMq.start()
    this.zmqClients.set(uuid, zeroMq)
    // 送信
    ws.send(`{"uid": "${uuid}"}`)
  }

  /**
   * クローズ
   * @param code コード
   * @param reason 理由
   */
  private closedWebSocket = (code: number, reason: Buffer): void => {
    this.logger.debug(`code: ${code}, reason: ${reason.toString()}`)
    for (const [key, val] of this.wsClients) {
      if (val.readyState === WebSocket.CLOSED) {
        this.logger.info(`delete uuid: ${key}`)
        // WebSocketクライアントリストから削除
        this.wsClients.delete(key)
        // ZeroMQクライアントリストから削除
        this.zmqClients.get(key)?.close()
        this.zmqClients.delete(key)
      }
    }
  }
}
