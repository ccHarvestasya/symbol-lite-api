export type WsCosignature = {
  topic: string
  data: {
    version: string
    signerPublicKey: string
    signature: string
    parentHash: string
  }
}
