import { Hash256, utils } from 'symbol-sdk'
import { models } from 'symbol-sdk/symbol'
import { WebSocket } from 'ws'
import { Subscriber } from 'zeromq'
import { ConfigManager } from '../utils/configManager.js'
import { Logger } from '../utils/logger.js'

export class SymbolZeroMq {
  private ws: WebSocket
  private sock: Subscriber
  private tcpAddress: string
  private cnfMgr = ConfigManager.getInstance()
  private logger = new Logger('WebSocket')

  private blockMarker = Buffer.from(utils.hexToUint8('9FF2D8E480CA6A49').reverse())
  private finalizedBlockMarker = Buffer.from(utils.hexToUint8('4D4832A031CE7954').reverse())
  // private dropMarker = Buffer.from(utils.hexToUint8('5C20D68AEE25B0B0').reverse())
  private confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
  private unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
  private unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
  private partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
  private partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
  private cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
  private statusMarker = Buffer.from(utils.hexToUint8('73'))

  /**
   * コンストラクタ
   * @param ws WebSocket
   * @param host ZeroMQ接続ホスト
   * @param port ZeroMQ接続ポート
   */
  constructor(ws: WebSocket) {
    this.ws = ws
    this.sock = new Subscriber({
      connectTimeout: this.cnfMgr.config.websocket.mq.connectTimeout,
      tcpKeepaliveInterval: this.cnfMgr.config.websocket.mq.monitorInterval,
      tcpKeepaliveCount: this.cnfMgr.config.websocket.mq.maxSubscriptions,
    })
    const host = this.cnfMgr.config.websocket.mq.host
    const port = this.cnfMgr.config.websocket.mq.port
    this.tcpAddress = `tcp://${host}:${port}`
    this.sock.connect(this.tcpAddress)
    this.logger.info(`Connecting to ${this.tcpAddress}`)
  }

  /**
   * ZeroMQ開始
   */
  start = async (): Promise<void> => {
    // eslint-disable-next-line no-constant-condition
    while (true) this.sendWebSocket(await this.sock.receive())
  }

  /**
   * 切断
   */
  close = (): void => this.sock.disconnect(this.tcpAddress)

  /**
   * 購読開始
   * @param topic トピック
   */
  subscribe = (topic: string): void => {
    if (topic === 'block') this.sock.subscribe(this.blockMarker)
    else if (topic === 'finalizedBlock') this.sock.subscribe(this.finalizedBlockMarker)
    else if (topic === 'confirmedAdded') this.sock.subscribe(this.confirmedAddedMarker)
    else if (topic === 'unconfirmedAdded') this.sock.subscribe(this.unconfirmedAddedMarker)
    else if (topic === 'unconfirmedRemoved') this.sock.subscribe(this.unconfirmedRemovedMarker)
    else if (topic === 'partialAdded') this.sock.subscribe(this.partialAddedMarker)
    else if (topic === 'partialRemoved') this.sock.subscribe(this.partialRemovedMarker)
    else if (topic === 'cosignature') this.sock.subscribe(this.cosignatureMarker)
    else if (topic === 'status') this.sock.subscribe(this.statusMarker)
  }

  /**
   * 購読終了
   * @param topic トピック
   */
  unsubscribe = (topic: string): void => {
    if (topic === 'block') this.sock.unsubscribe(this.blockMarker)
    else if (topic === 'finalizedBlock') this.sock.unsubscribe(this.finalizedBlockMarker)
    else if (topic === 'confirmedAdded') this.sock.unsubscribe(this.confirmedAddedMarker)
    else if (topic === 'unconfirmedAdded') this.sock.unsubscribe(this.unconfirmedAddedMarker)
    else if (topic === 'unconfirmedRemoved') this.sock.unsubscribe(this.unconfirmedRemovedMarker)
    else if (topic === 'partialAdded') this.sock.unsubscribe(this.partialAddedMarker)
    else if (topic === 'partialRemoved') this.sock.unsubscribe(this.partialRemovedMarker)
    else if (topic === 'cosignature') this.sock.unsubscribe(this.cosignatureMarker)
    else if (topic === 'status') this.sock.unsubscribe(this.statusMarker)
  }

  /**
   * WebSocket送信
   * @param receiveDatas ZeroMQ受信データ
   */
  sendWebSocket = (receiveDatas: Buffer[]) => {
    const topic = receiveDatas[0]
    if (topic.equals(this.blockMarker)) this.sendBlock(receiveDatas)
    else if (topic.equals(this.finalizedBlockMarker)) this.sendFinalizedBlock(receiveDatas)
    else if (topic.readInt8() === this.confirmedAddedMarker.readInt8()) this.sendConfirmedAdded(receiveDatas)
    else if (topic.readInt8() === this.unconfirmedAddedMarker.readInt8()) this.sendUnconfirmedAdded(receiveDatas)
    else if (topic.readInt8() === this.unconfirmedRemovedMarker.readInt8()) this.sendUnconfirmedRemoved(receiveDatas)
    else if (topic.readInt8() === this.partialAddedMarker.readInt8()) this.sendPartialAdded(receiveDatas)
    else if (topic.readInt8() === this.partialRemovedMarker.readInt8()) this.sendPartialRemoved(receiveDatas)
    else if (topic.readInt8() === this.cosignatureMarker.readInt8()) this.sendCosignature(receiveDatas)
    else if (topic.readInt8() === this.statusMarker.readInt8()) this.sendStatus(receiveDatas)
  }

  /**
   * WebSocket送信(ブロック)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendBlock = (receiveDatas: Buffer[]) => {
    const blockHeaderBuf = receiveDatas[1]
    const entityHashBuf = receiveDatas[2]
    const generationHashBuf = receiveDatas[3]
    blockHeaderBuf.writeInt32LE(blockHeaderBuf.byteLength) // 先頭にあるサイズを実サイズに変更する
    const data = models.BlockFactory.deserialize(blockHeaderBuf) as models.Block
    const wsData = {
      topic: 'block',
      data: {
        block: data.toJson(),
        meta: {
          hash: new Hash256(entityHashBuf).toString(),
          generationHash: new Hash256(generationHashBuf).toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(ファイナライズ)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendFinalizedBlock = (receiveDatas: Buffer[]) => {
    const finalizedBlockHeaderBuf = receiveDatas[1]
    const data = models.FinalizedBlockHeader.deserialize(finalizedBlockHeaderBuf) as models.FinalizedBlockHeader
    const wsData = {
      topic: 'finalizedBlock',
      data: data.toJson(),
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(承認トランザクション追加)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendConfirmedAdded = (receiveDatas: Buffer[]) => {
    const txBuf = receiveDatas[1]
    const hashBuf = receiveDatas[2]
    const merkleComponentHashBuf = receiveDatas[3]
    const heightBuf = receiveDatas[4]
    const data = models.TransactionFactory.deserialize(txBuf) as models.Transaction
    const wsData = {
      topic: 'confirmedAdded',
      data: {
        transaction: data.toJson(),
        meta: {
          hash: new Hash256(hashBuf).toString(),
          merkleComponentHash: new Hash256(merkleComponentHashBuf).toString(),
          height: models.Height.deserialize(heightBuf).value.toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(未承認トランザクション追加)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendUnconfirmedAdded = (receiveDatas: Buffer[]) => {
    const txBuf = receiveDatas[1]
    const hashBuf = receiveDatas[2]
    const merkleComponentHashBuf = receiveDatas[3]
    const heightBuf = receiveDatas[4]
    const data = models.TransactionFactory.deserialize(txBuf) as models.Transaction
    const wsData = {
      topic: 'unconfirmedAdded',
      data: {
        transaction: data.toJson(),
        meta: {
          hash: new Hash256(hashBuf).toString(),
          merkleComponentHash: new Hash256(merkleComponentHashBuf).toString(),
          height: models.Height.deserialize(heightBuf).value.toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(未承認トランザクション削除)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendUnconfirmedRemoved = (receiveDatas: Buffer[]) => {
    const hashBuf = receiveDatas[1]
    const wsData = {
      topic: 'unconfirmedRemoved',
      data: {
        meta: {
          hash: new Hash256(hashBuf).toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(パーシャル追加)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendPartialAdded = (receiveDatas: Buffer[]) => {
    const txBuf = receiveDatas[1]
    const hashBuf = receiveDatas[2]
    const merkleComponentHashBuf = receiveDatas[3]
    const heightBuf = receiveDatas[4]
    const data = models.TransactionFactory.deserialize(txBuf) as models.Transaction
    const wsData = {
      topic: 'partialAdded',
      data: {
        transaction: data.toJson(),
        meta: {
          hash: new Hash256(hashBuf).toString(),
          merkleComponentHash: new Hash256(merkleComponentHashBuf).toString(),
          height: models.Height.deserialize(heightBuf).value.toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(パーシャル削除)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendPartialRemoved = (receiveDatas: Buffer[]) => {
    const hashBuf = receiveDatas[1]
    const wsData = {
      topic: 'partialRemoved',
      data: {
        meta: {
          hash: new Hash256(hashBuf).toString(),
        },
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(署名)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendCosignature = (receiveDatas: Buffer[]) => {
    const cosignatureBuf = receiveDatas[1]
    const data = models.Cosignature.deserialize(cosignatureBuf) as models.Cosignature
    const wsData = {
      topic: 'cosignature',
      data: data.toJson(),
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }

  /**
   * WebSocket送信(ステータス)
   * @param receiveDatas ZeroMQ受信データ
   */
  private sendStatus = (receiveDatas: Buffer[]) => {
    const hashBuf = receiveDatas[1]
    const codeBuf = receiveDatas[2]
    const deadlineBuf = receiveDatas[3]
    const wsData = {
      topic: 'status',
      data: {
        hash: new Hash256(hashBuf).toString(),
        code: codeBuf.toString(),
        deadline: models.Timestamp.deserialize(deadlineBuf).toString(),
      },
    }
    // console.log(wsData)
    this.ws.send(JSON.stringify(wsData))
  }
}
