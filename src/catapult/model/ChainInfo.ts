/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
/** @deprecated */
export class ChainInfo {
  constructor(
    public readonly height: string,
    public readonly scoreHigh: string,
    public readonly scoreLow: string,
    public readonly latestFinalizedBlock: LatestFinalizedBlock
  ) {}
}

/** @deprecated */
export class LatestFinalizedBlock {
  constructor(
    public readonly finalizationEpoch: number,
    public readonly finalizationPoint: number,
    public readonly height: string,
    public readonly hash: string
  ) {}
}
