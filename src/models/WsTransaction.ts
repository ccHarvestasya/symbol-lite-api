export type WsTransaction = {
  topic: string
  data: { transaction: WsTransactionData }
}

export type WsTransactionData = {
  signature: string
  signerPublicKey: string
  version: number
  network: number
  type: number
  maxFee: string
  deadline: string
}

export type WsEmbeddedTransactionData = {
  signerPublicKey: string
  version: number
  network: number
  type: number
  recipientAddress: string
  mosaics: [{ id: string; amount: string }]
}
