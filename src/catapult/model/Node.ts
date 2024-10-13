import { X509Certificate } from 'node:crypto'
import { PacketBuffer } from '../PacketBuffer.js'

export class NodeInfo {
  constructor(
    public version: number,
    public publicKey: string,
    public networkGenerationHashSeed: string,
    public roles: number,
    public port: number,
    public networkIdentifier: number,
    public host: string,
    public friendlyName: string,
    public nodePublicKey?: string,
    public certificateExpirationDate?: Date
  ) {}

  static deserialize(payload: Uint8Array, cert?: X509Certificate) {
    const nodeBufferView = new PacketBuffer(Buffer.from(payload))
    const version = nodeBufferView.readUInt32LE(4)
    const publicKey = nodeBufferView.readHexString(32).toUpperCase()
    const networkGenerationHashSeed = nodeBufferView.readHexString(32).toUpperCase()
    const roles = nodeBufferView.readUInt32LE()
    const port = nodeBufferView.readUInt16LE()
    const networkIdentifier = nodeBufferView.readUInt8()
    const hostLength = nodeBufferView.readUInt8()
    const friendlyNameLength = nodeBufferView.readUInt8()
    const host = nodeBufferView.readString(hostLength)
    const friendlyName = nodeBufferView.readString(friendlyNameLength)
    // 証明書有効期限、ノード公開鍵取得
    let nodePublicKey: string | undefined
    let certificateExpirationDate: Date | undefined
    if (cert) {
      nodePublicKey = cert.publicKey
        .export({
          format: 'der',
          type: 'spki',
        })
        .toString('hex', 12, 44)
        .toUpperCase()
      const { validTo } = cert
      const validToDate = new Date(validTo)
      certificateExpirationDate = validToDate
    }
    return new NodeInfo(
      version,
      publicKey,
      networkGenerationHashSeed,
      roles,
      port,
      networkIdentifier,
      host,
      friendlyName,
      nodePublicKey,
      certificateExpirationDate
    )
  }
}

export class NodePeers {
  constructor(public nodePeers: NodePeer[]) {}

  static deserialize(payload: Uint8Array) {
    const nodePeers: NodePeer[] | undefined = []
    const nodeBufferView = new PacketBuffer(Buffer.from(payload))
    while (nodeBufferView.index < nodeBufferView.length) {
      const version = nodeBufferView.readUInt32LE(4)
      const publicKey = nodeBufferView.readHexString(32).toUpperCase()
      const networkGenerationHashSeed = nodeBufferView.readHexString(32).toUpperCase()
      const roles = nodeBufferView.readUInt32LE()
      const port = nodeBufferView.readUInt16LE()
      const networkIdentifier = nodeBufferView.readUInt8()
      const hostLength = nodeBufferView.readUInt8()
      const friendlyNameLength = nodeBufferView.readUInt8()
      const host = nodeBufferView.readString(hostLength)
      const friendlyName = nodeBufferView.readString(friendlyNameLength)
      const nodePeer = new NodePeer(
        version,
        publicKey,
        networkGenerationHashSeed,
        roles,
        port,
        networkIdentifier,
        host,
        friendlyName
      )
      nodePeers.push(nodePeer)
    }
    return new NodePeers(nodePeers)
  }

  toJson() {
    const peers = []
    for (const nodePeer of this.nodePeers) peers.push(nodePeer.toJson())
    return peers
  }
}

export class NodePeer {
  constructor(
    public version: number,
    public publicKey: string,
    public networkGenerationHashSeed: string,
    public roles: number,
    public port: number,
    public networkIdentifier: number,
    public host: string,
    public friendlyName: string
  ) {}

  toJson() {
    return {
      version: this.version,
      publicKey: this.publicKey,
      networkGenerationHashSeed: this.networkGenerationHashSeed,
      roles: this.roles,
      port: this.port,
      networkIdentifier: this.networkIdentifier,
      host: this.host,
      friendlyName: this.friendlyName,
    }
  }
}
