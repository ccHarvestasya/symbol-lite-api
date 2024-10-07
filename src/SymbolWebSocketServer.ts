import { randomUUID } from 'crypto'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { SymbolZeroMq } from './SymbolZeroMq.js'

export class SymbolWebSocketServer {
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
          if (recvData['subscribe']) this.subscribe(recvData['uid'], recvData['subscribe'])
          else if (recvData['unsubscribe']) this.unsubscribe(recvData['uid'], recvData['unsubscribe'])
          else throw Error()
        } catch (err: any) {
          if (err && err.message) ws.close(1013, err.message)
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
   * 購読開始
   * @param uuid UUID
   * @param topic topic
   */
  subscribe = (uuid: string, topic: string) => {
    if (topic === 'block') this.zmqClients.get(uuid)!.subscribeBlock()
    else if (topic === 'finalizedBlock') this.zmqClients.get(uuid)!.subscribeFinalized()
    else if (topic === 'confirmedAdded') this.zmqClients.get(uuid)!.subscribeConfirmedAdded()
  }

  /**
   * 購読終了
   * @param uuid UUID
   * @param topic topic
   */
  unsubscribe = (uuid: string, topic: string) => {
    if (topic === 'block') this.zmqClients.get(uuid)!.unsubscribeBlock()
    else if (topic === 'finalizedBlock') this.zmqClients.get(uuid)!.unsubscribeFinalized()
    else if (topic === 'confirmedAdded') this.zmqClients.get(uuid)!.unsubscribeConfirmedAdded()
  }

  /**
   * 接続時処理
   * @param ws WebSocket
   */
  private assignClientId = (ws: WebSocket): void => {
    // UUID取得
    const uuid = randomUUID().replaceAll('-', '').toUpperCase()
    console.debug(`{"uid": "${uuid}"}`)
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
    console.debug(`code: ${code}`, `reason: ${reason.toString()}`)
    for (const [key, val] of this.wsClients) {
      if (val.readyState === WebSocket.CLOSED) {
        console.log(`delete uuid: ${key}`)
        // WebSocketクライアントリストから削除
        this.wsClients.delete(key)
        // ZeroMQクライアントリストから削除
        this.zmqClients.get(key)?.close()
        this.zmqClients.delete(key)
      }
    }
  }
}
