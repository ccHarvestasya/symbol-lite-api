import { models } from 'symbol-sdk/symbol'

export class WebSocketJson {
  block = (bufData: Buffer) => {
    bufData.writeInt32LE(bufData.byteLength) // 先頭にあるサイズを実サイズに変更する
    const data = models.BlockFactory.deserialize(bufData) as models.Block
    console.log(data.toJson())
  }
  transaction = (bufData: Buffer) => {
    const data = models.TransactionFactory.deserialize(bufData) as models.Transaction
    console.log(data.toJson())
  }
}
