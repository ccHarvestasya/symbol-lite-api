export type WsFinalizedBlock = {
  topic: string
  data: WsFinalizedBlockData
}

export type WsFinalizedBlockData = {
  finalizationEpoch: number
  finalizationPoint: number
  height: string
  hash: string
}
