export type WsBlock = {
  topic: string
  data: WsBlockData
}

export type WsBlockData = {
  block: {
    signature: string
    signerPublicKey: string
    version: number
    network: number
    type: number
    height: string
    timestamp: string
    difficulty: string
    proofGamma: string
    proofVerificationHash: string
    proofScalar: string
    previousBlockHash: string
    transactionsHash: string
    receiptsHash: string
    stateHash: string
    beneficiaryAddress: string
    feeMultiplier: number
    votingEligibleAccountsCount?: number
    harvestingEligibleAccountsCount?: string
    totalVotingBalance?: string
    previousImportanceBlockHash?: string
  }
  meta: {
    hash: string
    generationHash: string
  }
}
