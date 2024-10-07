export type WsRemovedTx = {
  topic: string
  data: {
    meta: {
      hash: string
    }
  }
}
