import { X509Certificate } from 'node:crypto'
import fs from 'node:fs'
import tls, { ConnectionOptions } from 'node:tls'

/**
 * SSLソケット
 */
export abstract class SslSocket {
  /** コネクションオプション */
  private _connectionOptions: ConnectionOptions

  /** X509証明書 */
  protected _x509Certificate: X509Certificate | undefined

  /** ソケット */
  private tlsSocket: tls.TLSSocket | undefined

  /** Symbolヘッダーサイズ */
  private readonly SYMBOL_HEADER_SIZE = 8

  /**
   * コンストラクタ
   * @param host ホスト
   * @param port ポート(デフォルト: 7900)
   * @param timeout タイムアウト(デフォルト: 3000)
   */
  constructor(
    protected readonly certPath: string,
    protected readonly host: string,
    protected readonly port: number = 7900,
    private readonly timeout: number = 3000
  ) {
    this._connectionOptions = {
      host,
      port,
      timeout,
      cert: fs.readFileSync(`${certPath}/node.full.crt.pem`),
      key: fs.readFileSync(`${certPath}/node.key.pem`),
      rejectUnauthorized: false,
    }
  }

  /**
   * ソケット接続
   */
  protected connect(): void {
    this.tlsSocket = tls.connect(this._connectionOptions)
  }

  /**
   * リクエスト
   * @param packetType パケットタイプ
   * @param payload ペイロード
   * @param isResponse レスポンス有無
   * @returns レスポンス
   */
  protected async request(
    packetType: number,
    payload?: Uint8Array,
    isResponse = true
  ): Promise<Uint8Array | undefined> {
    // Symbolパケット生成
    const payloadSize = payload ? payload.length : 0
    const packetSize = this.SYMBOL_HEADER_SIZE + payloadSize
    const symbolPacketBuffer = new ArrayBuffer(packetSize)
    // Symbolヘッダー編集
    const symbolHeader = new DataView(symbolPacketBuffer)
    symbolHeader.setUint32(0, packetSize, true)
    symbolHeader.setUint32(4, packetType, true)
    // Symbolペイロード編集
    if (payload) {
      const symbolPayload = new Uint8Array(symbolPacketBuffer, this.SYMBOL_HEADER_SIZE, payloadSize)
      symbolPayload.set(payload)
    }
    // 接続確認
    if (!this.tlsSocket || this.tlsSocket.closed) this.connect()
    if (!this.tlsSocket) throw Error('Failed to connect socket.')
    // Symbolパケット送信
    this.tlsSocket.write(new Uint8Array(symbolPacketBuffer))
    if (!isResponse) return // レスポンスなしの場合
    return await this.receiver(this.tlsSocket, packetType) // レスポンスありの場合
  }

  /**
   * 受信機
   * @param packetType パケットタイプ
   * @returns レスポンス
   */
  private async receiver(socket: tls.TLSSocket, packetType: number): Promise<Uint8Array | undefined> {
    return new Promise<Uint8Array | undefined>((resolve, reject) => {
      if (this.tlsSocket === undefined) reject('tlsSocket undefined.')

      let responseSize = this.SYMBOL_HEADER_SIZE // ヘッダ分のサイズを前もって付与
      let responseData: Uint8Array | undefined = undefined

      // SSL接続
      socket.on('secureConnect', () => (this._x509Certificate = socket.getPeerX509Certificate()))

      // データ受信
      socket.once('data', (data) => {
        // レスポンスデータ（ヘッダ）取得
        const nodeBufferView = Buffer.from(new Uint8Array(data).buffer)
        // レスポンスサイズチェック
        const responseDataSize = nodeBufferView.readUInt32LE(0)
        if (responseDataSize === 0) {
          socket.destroy()
          reject('Received data is empty.')
        }
        // レスポンスパケットタイプチェック
        const responsePacketType = nodeBufferView.readUInt32LE(4)
        if (responsePacketType !== packetType) {
          socket.destroy()
          reject(`Mismatch packet type: expect: ${packetType} actual: ${responsePacketType}`)
        }
        // ヘッダが問題なければデータ部取得
        socket.on('data', (data) => {
          const tempResponseData = new Uint8Array(data)
          responseSize += tempResponseData.length
          if (!responseData) {
            // 初回
            responseData = tempResponseData
          } else {
            // 連結
            const merged = new Uint8Array(responseData.length + tempResponseData.length)
            merged.set(responseData)
            merged.set(tempResponseData, responseData.length)
            responseData = merged
          }
          if (responseDataSize <= responseSize) {
            resolve(responseData)
          }
        })
      })
      // タイムアウト
      socket.on('timeout', () => {
        socket.destroy()
        reject('timeout')
      })
      // エラー
      socket.on('error', (error) => {
        socket.destroy()
        reject(error)
      })
      // 切断
      socket.on('close', () => {
        console.debug(`切断: ${packetType}`)
      })
    })
  }

  /**
   * ソケット切断
   */
  protected close() {
    if (this.tlsSocket && !this.tlsSocket.closed) {
      this.tlsSocket.end()
      this.tlsSocket.destroy()
    }
  }

  /**
   * catapult サーバへパケットを送信する
   * @param packetType パケットタイプ
   * @param payload ペイロード
   * @param isResponse レスポンス有無(デフォルト: true)
   * @returns レスポンスデータ
   * @deprecated
   */
  protected async requestSocket(
    packetType: number,
    payload?: Uint8Array,
    isResponse: boolean = true
  ): Promise<Uint8Array | undefined> {
    return new Promise<Uint8Array | undefined>((resolve, reject) => {
      const payloadSize = payload ? payload.length : 0
      let responseSize = 8 // ヘッダ分のサイズを前もって付与
      let responseData: Uint8Array | undefined

      // SSLソケット接続
      const socket = tls.connect(this._connectionOptions, () => {
        // Symbolパケット生成
        const headerSize = 8
        const packetSize = headerSize + payloadSize
        const symbolPacketBuffer = new ArrayBuffer(packetSize)
        // Symbolヘッダー編集
        const symbolHeader = new DataView(symbolPacketBuffer)
        symbolHeader.setUint32(0, packetSize, true)
        symbolHeader.setUint32(4, packetType, true)

        if (payload) {
          // Symbolペイロード編集
          const symbolPayload = new Uint8Array(symbolPacketBuffer, headerSize, payloadSize)
          symbolPayload.set(payload)
        }

        // Symbolパケット送信
        socket.write(new Uint8Array(symbolPacketBuffer))

        if (!isResponse) {
          // ソケット切断
          socket.destroy()
        }
      })

      // SSL接続
      socket.on('secureConnect', () => {
        const peerX509 = socket.getPeerX509Certificate()
        if (!peerX509) return
        this._x509Certificate = peerX509
      })

      // データ受信
      socket.once('data', (data) => {
        // レスポンスデータ（ヘッダ）取得
        const nodeBufferView = Buffer.from(new Uint8Array(data).buffer)
        // レスポンスサイズチェック
        const responseDataSize = nodeBufferView.readUInt32LE(0)
        if (responseDataSize === 0) {
          socket.destroy()
          reject(new Error('empty data'))
        }

        // レスポンスパケットタイプチェック
        const responsePacketType = nodeBufferView.readUInt32LE(4)
        if (responsePacketType !== packetType) {
          socket.destroy()
          reject(new Error(`mismatch packet type: expect: ${packetType} actual: ${responsePacketType}`))
        }

        // ヘッダが問題なければデータ部取得
        socket.on('data', (data) => {
          const tempResponseData = new Uint8Array(data)
          responseSize += tempResponseData.length
          if (responseData) {
            // 連結
            const merged = new Uint8Array(responseData.length + tempResponseData.length)
            merged.set(responseData)
            merged.set(tempResponseData, responseData.length)
            responseData = merged
          } else {
            // 初回
            responseData = tempResponseData
          }

          if (responseDataSize <= responseSize) {
            // 受信が終わったら終了
            socket.end()
            socket.destroy()
          }
        })
      })

      // タイムアウト
      socket.on('timeout', () => {
        socket.destroy()
        reject(new Error('catapult timeout'))
      })

      // エラー
      socket.on('error', (error) => {
        socket.destroy()
        reject(error)
      })

      // 切断
      socket.on('close', () => {
        resolve(responseData)
      })
    })
  }
}
