export type WsAddedTx = {
  topic: string
  data: {
    transaction: {
      signature: string
      signerPublicKey: string
      version: number
      network: number
      type: number
      maxFee: string
      deadline: string
      recipientAddress: string
      mosaics: [
        {
          id: string
          amount: string
        },
      ]
    }
    meta: {
      hash: string
      merkleComponentHash: string
      height: string
    }
  }
}
