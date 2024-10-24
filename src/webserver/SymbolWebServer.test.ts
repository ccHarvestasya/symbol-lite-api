/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepStrictEqual } from 'assert'
import http, { Server } from 'http'
import { after, before, describe, it, mock } from 'node:test'
import { utils } from 'symbol-sdk'
import { ConfigManager } from '../utils/configManager.js'
import { SymbolWebServer } from './SymbolWebServer.js'

/** コンフィグ初期化 */
ConfigManager.init()

/** サーバレスポンスモック */
class MockServerResponse {
  writeHead() {}
  end(_chunk: any, _cb?: () => void) {}
  get headersSent() {
    return true
  }
}

describe('WebServerのテスト', () => {
  let webServer: SymbolWebServer
  let server: Server
  let mockServerResponse: MockServerResponse

  before(() => {
    /** サーバ開始 */
    webServer = new SymbolWebServer()
    server = http.createServer(webServer.procedure)
    server.listen(3000)
    /** モック */
    mockServerResponse = new MockServerResponse()
    mock.method(mockServerResponse, 'writeHead', () => {})
  })

  after(() => {
    server.close()
  })

  describe('Chainのテスト', () => {
    it('/chain/infoのGETテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      mock.method(cat, 'getChainInfo', () => {
        return '{"test":"data"}'
      })

      /** テスト */
      const res = await fetch(new URL('/chain/info', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 200)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(await res.json(), '{"test":"data"}')
    })

    it('/chain/unkownのGETテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/chain/unkown', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"code":"ResourceNotFound","message":"/chain/unkown does not exist"}'
      )
    })

    it('/chainのPOSTテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/chain', 'http://localhost:3000'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(JSON.stringify(await res.json()), '{"code":"ResourceNotFound","message":"/chain does not exist"}')
    })

    it('/chainのPUTテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/chain', 'http://localhost:3000'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(JSON.stringify(await res.json()), '{"code":"ResourceNotFound","message":"/chain does not exist"}')
    })
  })

  describe('Nodeのテスト', () => {
    it('/node/infoのGETテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      mock.method(cat, 'getNodeInfo', () => {
        return '{"test":"data"}'
      })

      /** テスト */
      const res = await fetch(new URL('/node/info', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 200)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(await res.json(), '{"test":"data"}')
    })

    it('/node/peersのGETテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      mock.method(cat, 'getNodePeers', () => {
        return '{"test":"data"}'
      })

      /** テスト */
      const res = await fetch(new URL('/node/peers', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 200)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(await res.json(), '{"test":"data"}')
    })

    it('/node/unlockedaccountのGETテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      mock.method(cat, 'getNodeUnlockedAccount', () => {
        return '{"test":"data"}'
      })

      /** テスト */
      const res = await fetch(new URL('/node/unlockedaccount', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 200)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(await res.json(), '{"test":"data"}')
    })

    it('/node/timeのGETテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      mock.method(cat, 'getNodeTime', () => {
        return '{"test":"data"}'
      })

      /** テスト */
      const res = await fetch(new URL('/node/time', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 200)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(await res.json(), '{"test":"data"}')
    })

    it('/node/unkownのGETテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/node/unkown', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"code":"ResourceNotFound","message":"/node/unkown does not exist"}'
      )
    })

    it('/nodeのPOSTテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/node', 'http://localhost:3000'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(JSON.stringify(await res.json()), '{"code":"ResourceNotFound","message":"/node does not exist"}')
    })

    it('/nodeのPUTテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/node', 'http://localhost:3000'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(JSON.stringify(await res.json()), '{"code":"ResourceNotFound","message":"/node does not exist"}')
    })
  })

  describe('transactionsのテスト', () => {
    it('/transactionsのGETテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/transactions', 'http://localhost:3000'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"code":"ResourceNotFound","message":"/transactions does not exist"}'
      )
    })

    it('/transactionsのPOSTテスト', async () => {
      /** テスト */
      const res = await fetch(new URL('/transactions', 'http://localhost:3000'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      })

      /** 検証 */
      deepStrictEqual(res.status, 404)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"code":"ResourceNotFound","message":"/transactions does not exist"}'
      )
    })

    it('/transactionsのPUTテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      const mockAnnounce = mock.method(cat, 'announceTx', () => {
        return true
      })

      /** テスト */
      const res = await fetch(new URL('/transactions', 'http://localhost:3000'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{"payload": "FF00F0"}',
      })

      /** 検証 */
      deepStrictEqual(res.status, 202)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"message":"packet 9 was pushed to the network via /transactions"}'
      )
      deepStrictEqual(mockAnnounce.mock.calls[0].arguments[0], utils.hexToUint8('FF00F0'))
    })

    it('/transactions/partialのPUTテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      const mockAnnounce = mock.method(cat, 'announceTxPartial', () => {
        return true
      })

      /** テスト */
      const res = await fetch(new URL('/transactions/partial', 'http://localhost:3000'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{"payload": "FF00F0"}',
      })

      /** 検証 */
      deepStrictEqual(res.status, 202)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"message":"packet 256 was pushed to the network via /transactions/partial"}'
      )
      deepStrictEqual(mockAnnounce.mock.calls[0].arguments[0], utils.hexToUint8('FF00F0'))
    })

    it('/transactions/cosignatureのPUTテスト', async () => {
      /** モック */
      const cat = (webServer as any).catapult
      const mockAnnounce = mock.method(cat, 'announceTxCosignature', () => {
        return true
      })

      /** テスト */
      const res = await fetch(new URL('/transactions/cosignature', 'http://localhost:3000'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{"version":"0","parentHash":"1AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC","signature":"AEFB8E705294CBBDD5F439DD32B0CC704949E976FC38C953499F28C2A9EDA04A69474C33C4D892A5D98707D59378F6DE0CCDE244E2DCA2B11CFC461E0E287202","signerPublicKey":"94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD"}',
      })

      /** 検証 */
      deepStrictEqual(res.status, 202)
      deepStrictEqual(res.headers.get('content-type'), 'application/json')
      deepStrictEqual(
        JSON.stringify(await res.json()),
        '{"message":"packet 257 was pushed to the network via /transactions/cosignature"}'
      )
      deepStrictEqual(
        mockAnnounce.mock.calls[0].arguments[0],
        utils.hexToUint8(
          '000000000000000094EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FDAEFB8E705294CBBDD5F439DD32B0CC704949E976FC38C953499F28C2A9EDA04A69474C33C4D892A5D98707D59378F6DE0CCDE244E2DCA2B11CFC461E0E2872021AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC'
        )
      )
    })
  })
})
