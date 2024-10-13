import { PacketBuffer } from '../PacketBuffer.js'

export class ChainInfo {
  constructor(
    public height: string,
    public scoreHigh: string,
    public scoreLow: string,
    public latestFinalizedBlock: LatestFinalizedBlock
  ) {}

  static create(chainStat: ChainStatistics, finalStat: FinalizationStatistics) {
    const latestFinalizedBlock = new LatestFinalizedBlock(
      finalStat.epoch,
      finalStat.point,
      finalStat.height.toString(),
      finalStat.hash
    )
    return new ChainInfo(
      chainStat.height.toString(),
      chainStat.scoreHigh.toString(),
      chainStat.scoreLow.toString(),
      latestFinalizedBlock
    )
  }

  toJson() {
    return {
      height: this.height.toString(),
      scoreHigh: this.scoreHigh.toString(),
      scoreLow: this.scoreLow.toString(),
      latestFinalizedBlock: this.latestFinalizedBlock.toJson(),
    }
  }
}

export class LatestFinalizedBlock {
  constructor(
    public finalizationEpoch: number,
    public finalizationPoint: number,
    public height: string,
    public hash: string
  ) {}

  toJson() {
    return {
      finalizationEpoch: this.finalizationEpoch,
      finalizationPoint: this.finalizationPoint,
      height: this.height,
      hash: this.hash,
    }
  }
}

export class ChainStatistics {
  constructor(
    public height: bigint,
    public finalizedHeight: bigint,
    public scoreHigh: bigint,
    public scoreLow: bigint
  ) {}

  static deserialize(payload: Uint8Array) {
    const bufferView = new PacketBuffer(Buffer.from(payload))
    const height = bufferView.readBigUInt64LE()
    const finalizedHeight = bufferView.readBigUInt64LE()
    const scoreHigh = bufferView.readBigUInt64LE()
    const scoreLow = bufferView.readBigUInt64LE()
    return new ChainStatistics(height, finalizedHeight, scoreHigh, scoreLow)
  }

  toJson() {
    return {
      height: this.height.toString(),
      finalizedHeight: this.finalizedHeight.toString(),
      scoreHigh: this.scoreHigh.toString(),
      scoreLow: this.scoreLow.toString(),
    }
  }
}

export class FinalizationStatistics {
  constructor(
    public epoch: number,
    public point: number,
    public height: bigint,
    public hash: string
  ) {}

  static deserialize(payload: Uint8Array) {
    const bufferView = new PacketBuffer(Buffer.from(payload))
    const epoch = bufferView.readUInt32LE()
    const point = bufferView.readUInt32LE()
    const height = bufferView.readBigUInt64LE()
    const hash = bufferView.readHexString(32).toUpperCase()
    return new FinalizationStatistics(epoch, point, height, hash)
  }

  toJson() {
    return {
      epoch: this.epoch,
      point: this.point,
      height: this.height.toString(),
      hash: this.hash,
    }
  }
}
