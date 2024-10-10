import { Hash256, utils } from 'symbol-sdk'
import { descriptors, models, SymbolFacade } from 'symbol-sdk/symbol'
import zmq, { Subscriber } from 'zeromq'
import { WsBlock } from './models/WsBlock.js'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { WsFinalizedBlock } from './models/WsFinalizedBlock.js'
import { appendFileSync, writeFileSync } from 'fs'

export class SymbolZeroMq {
  private ws: WebSocket
  private sock: Subscriber
  private tcpAddress: string

  private blockMarker = Buffer.from(utils.hexToUint8('9FF2D8E480CA6A49').reverse())
  private finalizedBlockMarker = Buffer.from(utils.hexToUint8('4D4832A031CE7954').reverse())
  private dropMarker = Buffer.from(utils.hexToUint8('5C20D68AEE25B0B0').reverse())
  private confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
  private unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
  private unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
  private partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
  private partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
  private cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
  private statusMarker = Buffer.from(utils.hexToUint8('73'))

  constructor(ws: WebSocket, host = 'localhost', port = 7902) {
    this.ws = ws
    this.sock = new Subscriber()
    this.tcpAddress = `tcp://${host}:${port}`
    this.sock.connect(this.tcpAddress)
    console.log(`Connecting to ${this.tcpAddress}`)
  }

  /** 開始 */
  start = async () => {
    while (true) {
      const receiveData = await this.sock.receive()
      const topic = receiveData[0]
      console.log(receiveData)
      console.log('topic', topic)

      if (topic.equals(this.blockMarker)) this.notifyBlock(receiveData[1], receiveData[2], receiveData[3])
      else if (topic.equals(this.finalizedBlockMarker)) this.notifyfinalizedBlock(receiveData[1])
      else if (topic.readInt8() === this.confirmedAddedMarker.readInt8())
        this.notifyConfirmedAdded(receiveData[1], receiveData[2], receiveData[3], receiveData[4])
    }
  }

  getTestData = async () => {
    while (true) {
      const receiveData = await this.sock.receive()
      const topic = receiveData[0]
      console.log(receiveData)
      console.log('topic', topic)

      if (topic.equals(this.blockMarker)) {
        receiveData[1].writeInt32LE(receiveData[1].byteLength) // 先頭にあるサイズを実サイズに変更する
        const data = models.BlockFactory.deserialize(receiveData[1]) as models.Block
        appendFileSync('block_' + data.type.toString(), receiveData[1].toString('hex') + '\n')
      } else if (topic.equals(this.finalizedBlockMarker)) {
        // const data = models.FinalizedBlockHeader.deserialize(receiveData[1]) as models.FinalizedBlockHeader
        appendFileSync('finalized', receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.confirmedAddedMarker.readInt8()) {
        const data = models.TransactionFactory.deserialize(receiveData[1]) as models.Transaction
        appendFileSync('confirmedAdded_' + data.type.toString(), receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.unconfirmedAddedMarker.readInt8()) {
        const data = models.TransactionFactory.deserialize(receiveData[1]) as models.Transaction
        appendFileSync('unconfirmedAdded_' + data.type.toString(), receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.unconfirmedRemovedMarker.readInt8()) {
        appendFileSync('unconfirmedRemoved', receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.partialAddedMarker.readInt8()) {
        appendFileSync('partialAdded', receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.partialRemovedMarker.readInt8()) {
        appendFileSync('partialRemoved', receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.cosignatureMarker.readInt8()) {
        appendFileSync('cosignature', receiveData[1].toString('hex') + '\n')
      } else if (topic.readInt8() === this.statusMarker.readInt8()) {
        appendFileSync('status', receiveData[1].toString('hex') + '\n')
      }
    }
  }

  /** 切断 */
  close = () => this.sock.disconnect(this.tcpAddress)

  /** ブロック生成 購読開始 */
  subscribeBlock = () => this.sock.subscribe(this.blockMarker)
  /** ブロック生成 購読終了 */
  unsubscribeBlock = () => this.sock.unsubscribe(this.blockMarker)
  /** ファイナライズ 購読開始 */
  subscribeFinalizedBlock = () => this.sock.subscribe(this.finalizedBlockMarker)
  /** ファイナライズ 購読終了 */
  unsubscribeFinalizedBlock = () => this.sock.unsubscribe(this.finalizedBlockMarker)
  /** ブロック取消 購読開始 */
  subscribeDrop = () => this.sock.subscribe(this.dropMarker)
  /** 承認トランザクション 購読開始 */
  subscribeConfirmedAdded = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.confirmedAddedMarker, address.bytes]) : this.confirmedAddedMarker
    this.sock.subscribe(marker)
  }
  /** 承認トランザクション 購読終了 */
  unsubscribeConfirmedAdded = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.confirmedAddedMarker, address.bytes]) : this.confirmedAddedMarker
    this.sock.unsubscribe(marker)
  }
  /** 未承認トランザクション追加 購読開始 */
  subscribeUnconfirmedTxAdded = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.unconfirmedAddedMarker, address.bytes]) : this.unconfirmedAddedMarker
    this.sock.subscribe(marker)
  }
  /** 未承認トランザクション追加 購読終了 */
  unsubscribeUnconfirmedTxAdd = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.unconfirmedAddedMarker, address.bytes]) : this.unconfirmedAddedMarker
    this.sock.unsubscribe(marker)
  }
  /** 未承認トランザクション削除 購読開始 */
  subscribeUnconfirmedTxRemoved = (address?: models.Address) => {
    const marker = address
      ? Buffer.concat([this.unconfirmedRemovedMarker, address.bytes])
      : this.unconfirmedRemovedMarker
    this.sock.subscribe(marker)
  }
  /** 未承認トランザクション削除 購読終了 */
  unsubscribeUnconfirmedTxDRemoved = (address?: models.Address) => {
    const marker = address
      ? Buffer.concat([this.unconfirmedRemovedMarker, address.bytes])
      : this.unconfirmedRemovedMarker
    this.sock.unsubscribe(marker)
  }
  /** パーシャルトランザクション追加 購読開始 */
  subscribePartialAdded = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.partialAddedMarker, address.bytes]) : this.partialAddedMarker
    this.sock.subscribe(marker)
  }
  /** パーシャルトランザクション追加 購読終了 */
  unsubscribePartialAdded = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.partialAddedMarker, address.bytes]) : this.partialAddedMarker
    this.sock.unsubscribe(marker)
  }
  /** パーシャルトランザクション削除 購読開始 */
  subscribePartialRemoved = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.partialRemovedMarker, address.bytes]) : this.partialRemovedMarker
    this.sock.subscribe(marker)
  }
  /** パーシャルトランザクション削除 購読終了 */
  unsubscribePartialRemoved = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.partialRemovedMarker, address.bytes]) : this.partialRemovedMarker
    this.sock.unsubscribe(marker)
  }
  /** ステータス 購読開始 */
  subscribeStatus = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.statusMarker, address.bytes]) : this.statusMarker
    this.sock.subscribe(marker)
  }
  /** ステータス 購読終了 */
  unsubscribeStatus = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.statusMarker, address.bytes]) : this.statusMarker
    this.sock.unsubscribe(marker)
  }
  /** 署名 購読開始 */
  subscribeCosignature = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.cosignatureMarker, address.bytes]) : this.cosignatureMarker
    this.sock.subscribe(marker)
  }
  /** 署名 購読終了 */
  unsubscribeCosignature = (address?: models.Address) => {
    const marker = address ? Buffer.concat([this.cosignatureMarker, address.bytes]) : this.cosignatureMarker
    this.sock.unsubscribe(marker)
  }

  private notifyBlock(blockHeader: Buffer, entityHash: Buffer, generationHash: Buffer) {
    blockHeader.writeInt32LE(blockHeader.byteLength) // 先頭にあるサイズを実サイズに変更する
    const header = models.BlockFactory.deserialize(blockHeader) as models.Block

    const wsBlock: WsBlock = {
      topic: 'block',
      data: {
        block: {
          signature: header.signature.toString(),
          signerPublicKey: header.signerPublicKey.toString(),
          version: header.version,
          network: header.network.value,
          type: header.type.value,
          height: header.height.value.toString(),
          timestamp: header.timestamp.value.toString(),
          difficulty: header.difficulty.value.toString(),
          proofGamma: header.generationHashProof.gamma.toString(),
          proofVerificationHash: header.generationHashProof.verificationHash.toString(),
          proofScalar: header.generationHashProof.scalar.toString(),
          previousBlockHash: header.previousBlockHash.toString(),
          transactionsHash: header.transactionsHash.toString(),
          receiptsHash: header.receiptsHash.toString(),
          stateHash: header.stateHash.toString(),
          beneficiaryAddress: header.beneficiaryAddress.toString(),
          feeMultiplier: header.feeMultiplier.value as number,
          votingEligibleAccountsCount: (header as models.ImportanceBlockV1).votingEligibleAccountsCount,
          harvestingEligibleAccountsCount: (
            header as models.ImportanceBlockV1
          ).harvestingEligibleAccountsCount?.toString(),
          totalVotingBalance: (header as models.ImportanceBlockV1).totalVotingBalance?.value.toString(),
          previousImportanceBlockHash: (header as models.ImportanceBlockV1).previousImportanceBlockHash?.toString(),
        },
        meta: {
          hash: new Hash256(entityHash).toString(),
          generationHash: new Hash256(generationHash).toString(),
        },
      },
    }

    this.ws.send(JSON.stringify(wsBlock))
  }

  private notifyfinalizedBlock = (blockHeader: Buffer) => {
    const header = models.FinalizedBlockHeader.deserialize(blockHeader) as models.FinalizedBlockHeader

    const wsFinalizedBlock: WsFinalizedBlock = {
      topic: 'finalizedBlock',
      data: {
        finalizationEpoch: header.round.epoch.value as number,
        finalizationPoint: header.round.point.value as number,
        height: header.height.value.toString(),
        hash: header.hash.toString(),
      },
    }

    this.ws.send(JSON.stringify(wsFinalizedBlock))
  }

  private notifyConfirmedAdded = (tranBuffer: Buffer, hash: Buffer, merkleComponentHash: Buffer, height: Buffer) => {
    const tran = models.TransactionFactory.deserialize(tranBuffer) as models.Transaction
    console.log(tran.toString())
  }

  private notifyUnconfirmedAdded = () => {}

  private notifyUnconfirmedRemoved = () => {}

  private notifyPartialAdded = () => {}

  private notifyPartialRemoved = () => {}

  private notifyCosignature = () => {}

  private notifyStatus = () => {}
}
