import { ChainInfo, ChainStatistics, FinalizationStatistics } from './model/Chain.js'
import {
  NodeActiveNodeInfos,
  NodeDiagnosticCounter,
  NodeInfo,
  NodePeers,
  NodeTime,
  NodeUnlockedAccount,
} from './model/Node.js'
import { SslSocket } from './SslSocket.js'

export class Catapult extends SslSocket {
  private CORE = 0x43
  private LOCK_HASH = 0x48
  private LOCK_SECRET = 0x52
  private METADATA = 0x44
  private MOSAIC = 0x4d
  private MULTISIG = 0x55
  private NAMESPACE = 0x4e
  private RESTRICTION_ACCOUNT = 0x50
  private RESTRICTION_MOSAIC = 0x51

  /** パケットタイプ */
  private PacketType = {
    PULL_BLOCK: 0x0_04,
    CHAIN_STATISTICS: 0x0_05,
    BLOCK_HASHES: 0x0_07,
    PULL_BLOCKS: 0x0_08,
    PUSH_TRANSACTIONS: 0x0_09,
    PUSH_PARTIAL_TRANSACTIONS: 0x1_00,
    PUSH_DETACHED_COSIGNATURES: 0x1_01,
    PULL_PARTIAL_TRANSACTION_INFOS: 0x1_02,
    NODE_DISCOVERY_PULL_PING: 0x1_11,
    NODE_DISCOVERY_PULL_PEERS: 0x1_13,
    TIME_SYNC_NETWORK_TIME: 0x1_20,
    PULL_FINALIZATION_MESSAGES: 0x1_31,
    FINALIZATION_STATISTICS: 0x1_32,
    FINALIZATION_PROOF_AT_EPOCH: 0x1_33,
    FINALIZATION_PROOF_AT_HEIGHT: 0x1_34,
    PULL_FINALIZATION_PROOF: 0x1_35,
    ACCOUNT_STATE_PATH: 0x2_00 + this.CORE,
    HASH_LOCK_STATE_PATH: 0x2_00 + this.LOCK_HASH,
    SECRET_LOCK_STATE_PATH: 0x2_00 + this.LOCK_SECRET,
    METADATA_STATE_PATH: 0x2_00 + this.METADATA,
    MOSAIC_STATE_PATH: 0x2_00 + this.MOSAIC,
    MULTISIG_STATE_PATH: 0x2_00 + this.MULTISIG,
    NAMESPACE_STATE_PATH: 0x2_00 + this.NAMESPACE,
    ACCOUNT_RESTRICTIONS_STATE_PATH: 0x2_00 + this.RESTRICTION_ACCOUNT,
    MOSAIC_RESTRICTIONS_STATE_PATH: 0x2_00 + this.RESTRICTION_MOSAIC,
    DIAGNOSTIC_COUNTERS: 0x3_00,
    CONFIRM_TIMESTAMPED_HASHES: 0x3_01,
    ACTIVE_NODE_INFOS: 0x3_02,
    BLOCK_STATEMENT: 0x3_03,
    UNLOCKED_ACCOUNTS: 0x3_04,
    ACCOUNT_INFOS: 0x4_00 + this.CORE,
    HASH_LOCK_INFOS: 0x4_00 + this.LOCK_HASH,
    SECRET_LOCK_INFOS: 0x4_00 + this.LOCK_SECRET,
    METADATA_INFOS: 0x4_00 + this.METADATA,
    MOSAIC_INFOS: 0x4_00 + this.MOSAIC,
    MULTISIG_INFOS: 0x4_00 + this.MULTISIG,
    NAMESPACE_INFOS: 0x4_00 + this.NAMESPACE,
    ACCOUNT_RESTRICTIONS_INFOS: 0x4_00 + this.RESTRICTION_ACCOUNT,
    MOSAIC_RESTRICTIONS_INFOS: 0x4_00 + this.RESTRICTION_MOSAIC,
  }

  /**
   * /chain/info 同等の値を持つクラスを取得
   * @returns ChainInfo
   */
  async getChainInfo() {
    this.logger.info('ChainInfo')
    let chainInfo: ChainInfo | undefined
    try {
      const chainStat = await this.getChainStatistics()
      const finalStat = await this.getFinalizationStatistics()
      if (chainStat && finalStat) chainInfo = ChainInfo.create(chainStat, finalStat)
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return chainInfo
  }

  /**
   * ChainStatistics取得
   * @returns 成功: ChainStatistics, 失敗: undefined
   */
  private async getChainStatistics() {
    let chainStatistics: ChainStatistics | undefined
    try {
      const socketData = await this.request(this.PacketType.CHAIN_STATISTICS)
      if (socketData) chainStatistics = ChainStatistics.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return chainStatistics
  }

  /**
   * FinalizationStatistics取得
   * @returns 成功: FinalizationStatistics, 失敗: undefined
   */
  private async getFinalizationStatistics() {
    let finalizationStatistics: FinalizationStatistics | undefined
    try {
      const socketData = await this.request(this.PacketType.FINALIZATION_STATISTICS)
      if (socketData) finalizationStatistics = FinalizationStatistics.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return finalizationStatistics
  }

  /**
   * /node/info 同等の値を持つクラスを取得
   * @returns NodeInfo
   */
  async getNodeInfo(): Promise<NodeInfo | undefined> {
    this.logger.info('NodeInfo')
    let nodeInfo: NodeInfo | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.NODE_DISCOVERY_PULL_PING)
      if (socketData) nodeInfo = NodeInfo.deserialize(socketData, this._x509Certificate)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return nodeInfo
  }

  /**
   * /node/peers 同等の値を持つクラスを取得
   * @returns NodePeers
   */
  async getNodePeers(): Promise<NodePeers | undefined> {
    this.logger.info('NodePeers')
    let nodePeers: NodePeers | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.NODE_DISCOVERY_PULL_PEERS)
      if (socketData) nodePeers = NodePeers.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return nodePeers
  }

  /**
   * /node/time 同等の値を持つクラスを取得
   * @returns NodeTime
   */
  async getNodeTime() {
    this.logger.info('NodeTime')
    let nodeTime: NodeTime | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.TIME_SYNC_NETWORK_TIME)
      if (socketData) nodeTime = NodeTime.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return nodeTime
  }

  /**
   * /node/unlockedAccount 同等の値を持つクラスを取得
   * @returns NodeUnlockedAccount
   */
  async getNodeUnlockedAccount() {
    this.logger.info('NodeUnlockedAccount')
    let nodeUnlockedAccount: NodeUnlockedAccount | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.UNLOCKED_ACCOUNTS)
      if (socketData) nodeUnlockedAccount = NodeUnlockedAccount.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return nodeUnlockedAccount
  }

  /**
   * DiagnosticCounters取得
   * @returns 診断カウンター
   */
  async getDiagnosticCounter(): Promise<NodeDiagnosticCounter | undefined> {
    this.logger.info('DiagnosticCounter')
    let diagnosticCounter: NodeDiagnosticCounter | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.DIAGNOSTIC_COUNTERS)
      if (socketData) diagnosticCounter = NodeDiagnosticCounter.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }

    return diagnosticCounter
  }

  async getActiveNodeInfos() {
    this.logger.info('ActiveNodeInfos')
    let activeNodeInfos: NodeActiveNodeInfos | undefined
    try {
      // ピア問合せ
      const socketData = await this.request(this.PacketType.ACTIVE_NODE_INFOS)
      if (socketData) activeNodeInfos = NodeActiveNodeInfos.deserialize(socketData)
      // if (socketData) console.log(Buffer.from(socketData).toString('hex')) // テストデータ抜き
      // if (socketData) writeFileSync('data.dat', socketData)
      this.close()
    } catch (e) {
      if (e instanceof Error) this.logger.error(e.message)
      else console.error(e)
    }
    return activeNodeInfos
  }

  /**
   * トランザクションアナウンス
   * @param payload トランザクションペイロード
   */
  async announceTx(payload: Uint8Array): Promise<boolean> {
    this.logger.info('announceTx')
    try {
      await this.request(this.PacketType.PUSH_TRANSACTIONS, payload, false)
      this.close()
    } catch {
      return false
    }
    return true
  }

  /**
   * アグリゲートボンデッドトランザクションアナウンス
   * API必要
   * @param payloadHex トランザクションペイロード
   * @returns
   */
  async announceTxPartial(payload: Uint8Array): Promise<boolean> {
    this.logger.info('announceTxPartial')
    try {
      await this.request(this.PacketType.PUSH_PARTIAL_TRANSACTIONS, payload, false)
      this.close()
    } catch {
      return false
    }
    return true
  }

  /**
   * アグリゲートボンデッドトランザクションアナウンス
   * API必要
   * @param payload トランザクションペイロード(Hex文字列)
   * @returns
   */
  async announceTxCosignature(payload: Uint8Array): Promise<boolean> {
    this.logger.info('announceTxPartial')
    try {
      await this.request(this.PacketType.PUSH_DETACHED_COSIGNATURES, payload, false)
      this.close()
    } catch {
      return false
    }
    return true
  }
}
