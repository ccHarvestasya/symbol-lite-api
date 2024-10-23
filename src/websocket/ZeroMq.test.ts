/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepStrictEqual } from 'node:assert'
import { describe, it, mock } from 'node:test'
import { utils } from 'symbol-sdk'
import { Address } from 'symbol-sdk/symbol'
import { WebSocket } from 'ws'
import { ConfigManager } from '../utils/configManager.js'
import { SymbolZeroMq } from './ZeroMq.js'

/** コンフィグ初期化 */
ConfigManager.init()

describe('SymbolZeroMqのテスト', () => {
  describe('subscribeテスト', () => {
    it('subscribe(block)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'block'
      zeromq.subscribe(topic)

      /** 検証 */
      const blockMarker = Buffer.from(utils.hexToUint8('9FF2D8E480CA6A49').reverse())
      deepStrictEqual(moc.mock.calls[0].arguments[0], blockMarker)
    })

    it('subscribe(finalizedBlock)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'finalizedBlock'
      zeromq.subscribe(topic)

      /** 検証 */
      const finalizedBlockMarker = Buffer.from(utils.hexToUint8('4D4832A031CE7954').reverse())
      deepStrictEqual(moc.mock.calls[0].arguments[0], finalizedBlockMarker)
    })

    it('subscribe(confirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'confirmedAdded'
      zeromq.subscribe(topic)

      /** 検証 */
      const confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], confirmedAddedMarker)
    })

    it('subscribe(confirmedAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'confirmedAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([confirmedAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(unconfirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedAdded'
      zeromq.subscribe(topic)

      /** 検証 */
      const unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], unconfirmedAddedMarker)
    })

    it('subscribe(unconfirmedAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([unconfirmedAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(unconfirmedRemoved)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedRemoved'
      zeromq.subscribe(topic)

      /** 検証 */
      const unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], unconfirmedRemovedMarker)
    })

    it('subscribe(unconfirmedRemovedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedRemoved/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([unconfirmedRemovedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(partialAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialAdded'
      zeromq.subscribe(topic)

      /** 検証 */
      const partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], partialAddedMarker)
    })

    it('subscribe(partialAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([partialAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(partialRemoved)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialRemoved'
      zeromq.subscribe(topic)

      /** 検証 */
      const partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], partialRemovedMarker)
    })

    it('subscribe(partialRemovedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialRemoved/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([partialRemovedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(cosignature)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'cosignature'
      zeromq.subscribe(topic)

      /** 検証 */
      const cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], cosignatureMarker)
    })

    it('subscribe(cosignatureアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'cosignature/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([cosignatureMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('subscribe(status)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'status'
      zeromq.subscribe(topic)

      /** 検証 */
      const statusMarker = Buffer.from(utils.hexToUint8('73'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], statusMarker)
    })

    it('subscribe(statusアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'status/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.subscribe(topic)

      /** 検証 */
      const statusMarker = Buffer.from(utils.hexToUint8('73'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([statusMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })
  })

  describe('unsubscribeテスト', () => {
    it('unsubscribe(block)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'block'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const blockMarker = Buffer.from(utils.hexToUint8('9FF2D8E480CA6A49').reverse())
      deepStrictEqual(moc.mock.calls[0].arguments[0], blockMarker)
    })

    it('unsubscribe(finalizedBlock)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'finalizedBlock'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const finalizedBlockMarker = Buffer.from(utils.hexToUint8('4D4832A031CE7954').reverse())
      deepStrictEqual(moc.mock.calls[0].arguments[0], finalizedBlockMarker)
    })

    it('unsubscribe(confirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'confirmedAdded'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], confirmedAddedMarker)
    })

    it('unsubscribe(confirmedAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'confirmedAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const confirmedAddedMarker = Buffer.from(utils.hexToUint8('61'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([confirmedAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(unconfirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedAdded'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], unconfirmedAddedMarker)
    })

    it('unsubscribe(unconfirmedAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const unconfirmedAddedMarker = Buffer.from(utils.hexToUint8('75'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([unconfirmedAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(unconfirmedRemoved)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedRemoved'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], unconfirmedRemovedMarker)
    })

    it('unsubscribe(unconfirmedRemovedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'unconfirmedRemoved/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const unconfirmedRemovedMarker = Buffer.from(utils.hexToUint8('72'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([unconfirmedRemovedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(partialAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialAdded'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], partialAddedMarker)
    })

    it('unsubscribe(partialAddedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialAdded/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const partialAddedMarker = Buffer.from(utils.hexToUint8('70'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([partialAddedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(partialRemoved)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialRemoved'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], partialRemovedMarker)
    })

    it('unsubscribe(partialRemovedアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'partialRemoved/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const partialRemovedMarker = Buffer.from(utils.hexToUint8('71'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([partialRemovedMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(cosignature)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'cosignature'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], cosignatureMarker)
    })

    it('unsubscribe(cosignatureアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'cosignature/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const cosignatureMarker = Buffer.from(utils.hexToUint8('63'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([cosignatureMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })

    it('unsubscribe(status)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'status'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const statusMarker = Buffer.from(utils.hexToUint8('73'))
      deepStrictEqual(moc.mock.calls[0].arguments[0], statusMarker)
    })

    it('unsubscribe(statusアドレス付)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execUnsubscribe', (_topic: Buffer) => {})

      /** テスト */
      const topic = 'status/TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A'
      zeromq.unsubscribe(topic)

      /** 検証 */
      const statusMarker = Buffer.from(utils.hexToUint8('73'))
      const addr = new Address('TBZN46UIU5BFLJI46VB4JTHHCE5EN2RFLR7NX3A').bytes
      const actualTopic = Buffer.concat([statusMarker, addr])
      deepStrictEqual(moc.mock.calls[0].arguments[0], actualTopic)
    })
  })

  describe('sendWebSocketテスト', () => {
    it('sendWebSocket(block)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

      /** テスト */
      const receiveDatas = [
        Buffer.from('496ACA80E4D8F29F', 'hex'),
        Buffer.from(
          '780100000000000035123B2E979607A263168BFCA8CB42CFE38149EEBCACA3411928E47B4DAB199AEC4B57ADC530D6DC9869AF7805D81000F6CE77E926EC296CAB9F126C5BF99F040340F9CA73A93F64CBCCE2E80B2E3F8AF195AAD6DC7B325E5C0A4DE103CDEBEB00000000019843818BD31B0000000000CBA80F860E00000000A0724E18090000892CDC27A56F5CD8DABDBC60C47ECC9C191D89C677381E212290D370B2282E33D6A80C0FC33609D33C89E92A804717762B8078A2A05AE15886F56ACB91D8D4C31F301F103D1DF13845DE7E073503AB0BCB7420B594DBF0B553272F5C51CA6135D5126FB456EBE9974E9C4E11D3FE1DE5000000000000000000000000000000000000000000000000000000000000000048B520A8D7BF73F375967954C452C2AE653651A260BAEF52D117558C4DADDCC0C4CD500F90291B59E6D83F72BED3F4F76B981465A1E071EEDB63BAEE9AB0212A981B6370BBD45899FA8450342741E92444359C3BE45060A10000000000000000',
          'hex'
        ),
        Buffer.from('F1FC5246619C8D0D9426C4027A57788706886A9DA1922A482990A2DCA7F334E7', 'hex'),
        Buffer.from('ED431F4B2965EE52E65207AF8582AE27CA75A5613385D8D0E1BBC1EC9E0F86E4', 'hex'),
      ]
      zeromq.sendWebSocket(receiveDatas)

      /** 検証 */
      deepStrictEqual(
        moc.mock.calls[0].arguments[0],
        '{"topic":"block","data":{"block":{"signature":"35123B2E979607A263168BFCA8CB42CFE38149EEBCACA3411928E47B4DAB199AEC4B57ADC530D6DC9869AF7805D81000F6CE77E926EC296CAB9F126C5BF99F04","signerPublicKey":"0340F9CA73A93F64CBCCE2E80B2E3F8AF195AAD6DC7B325E5C0A4DE103CDEBEB","version":1,"network":152,"type":33091,"height":"1823627","timestamp":"62378715339","difficulty":"10000000000000","generationHashProof":{"gamma":"892CDC27A56F5CD8DABDBC60C47ECC9C191D89C677381E212290D370B2282E33","verificationHash":"D6A80C0FC33609D33C89E92A80471776","scalar":"2B8078A2A05AE15886F56ACB91D8D4C31F301F103D1DF13845DE7E073503AB0B"},"previousBlockHash":"CB7420B594DBF0B553272F5C51CA6135D5126FB456EBE9974E9C4E11D3FE1DE5","transactionsHash":"0000000000000000000000000000000000000000000000000000000000000000","receiptsHash":"48B520A8D7BF73F375967954C452C2AE653651A260BAEF52D117558C4DADDCC0","stateHash":"C4CD500F90291B59E6D83F72BED3F4F76B981465A1E071EEDB63BAEE9AB0212A","beneficiaryAddress":"981B6370BBD45899FA8450342741E92444359C3BE45060A1","feeMultiplier":0,"transactions":[]},"meta":{"hash":"F1FC5246619C8D0D9426C4027A57788706886A9DA1922A482990A2DCA7F334E7","generationHash":"ED431F4B2965EE52E65207AF8582AE27CA75A5613385D8D0E1BBC1EC9E0F86E4"}}}'
      )
    })

    it('sendWebSocket(finalizedBlock)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

      /** テスト */
      const receiveDatas = [
        Buffer.from('5479CE31A032484D', 'hex'),
        Buffer.from(
          'E60900002A00000080D31B0000000000ABD74445A4C2CEE50028B42B65EDF59335BE52C36D0E8DE336E5456858D82C82',
          'hex'
        ),
      ]
      zeromq.sendWebSocket(receiveDatas)

      /** 検証 */
      deepStrictEqual(
        moc.mock.calls[0].arguments[0],
        '{"topic":"finalizedBlock","data":{"round":{"epoch":2534,"point":42},"height":"1823616","hash":"ABD74445A4C2CEE50028B42B65EDF59335BE52C36D0E8DE336E5456858D82C82"}}'
      )
    })

    it('sendWebSocket(confirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

      /** テスト */
      const receiveDatas = [
        Buffer.from('619872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
        Buffer.from(
          'DB00000000000000C282B5124FC0D8A9A085D46E8E49F5ADA8E02545DB45374B9FA8C586912E5E547A95F6EAEF6B1133228AB85BB291B7978ABFDC6B9ADFF515A6B8C347F0A9F40EB863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E00000000019854418C55000000000000B17B7F860E0000009852701708153EB74C71713F0AC7C56F5DE5670E061759542B00010000000000CE8BA0672E21C07240420F0000000000017A0F136CD7DAFE646DCBCA6D32A04351DBB51BAECE899AC80269A1929D646B405D4F1B98A067DEECF077',
          'hex'
        ),
        Buffer.from('071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A', 'hex'),
        Buffer.from('071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A', 'hex'),
        Buffer.from('8ED31B0000000000', 'hex'),
      ]
      zeromq.sendWebSocket(receiveDatas)

      /** 検証 */
      deepStrictEqual(
        moc.mock.calls[0].arguments[0],
        '{"topic":"confirmedAdded","data":{"transaction":{"signature":"C282B5124FC0D8A9A085D46E8E49F5ADA8E02545DB45374B9FA8C586912E5E547A95F6EAEF6B1133228AB85BB291B7978ABFDC6B9ADFF515A6B8C347F0A9F40E","signerPublicKey":"B863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E","version":1,"network":152,"type":16724,"fee":"21900","deadline":"62386043825","recipientAddress":"9852701708153EB74C71713F0AC7C56F5DE5670E06175954","mosaics":[{"mosaicId":"8268645399043017678","amount":"1000000"}],"message":"017A0F136CD7DAFE646DCBCA6D32A04351DBB51BAECE899AC80269A1929D646B405D4F1B98A067DEECF077"},"meta":{"hash":"071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A","merkleComponentHash":"071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A","height":"1823630"}}}'
      )
    })

    it('sendWebSocket(unconfirmedAdded)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

      /** テスト */
      const receiveDatas = [
        Buffer.from('759872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
        Buffer.from(
          'DB00000000000000C282B5124FC0D8A9A085D46E8E49F5ADA8E02545DB45374B9FA8C586912E5E547A95F6EAEF6B1133228AB85BB291B7978ABFDC6B9ADFF515A6B8C347F0A9F40EB863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E00000000019854418C55000000000000B17B7F860E0000009852701708153EB74C71713F0AC7C56F5DE5670E061759542B00010000000000CE8BA0672E21C07240420F0000000000017A0F136CD7DAFE646DCBCA6D32A04351DBB51BAECE899AC80269A1929D646B405D4F1B98A067DEECF077',
          'hex'
        ),
        Buffer.from('071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A', 'hex'),
        Buffer.from('071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A', 'hex'),
        Buffer.from('0000000000000000', 'hex'),
      ]
      zeromq.sendWebSocket(receiveDatas)

      /** 検証 */
      deepStrictEqual(
        moc.mock.calls[0].arguments[0],
        '{"topic":"unconfirmedAdded","data":{"transaction":{"signature":"C282B5124FC0D8A9A085D46E8E49F5ADA8E02545DB45374B9FA8C586912E5E547A95F6EAEF6B1133228AB85BB291B7978ABFDC6B9ADFF515A6B8C347F0A9F40E","signerPublicKey":"B863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E","version":1,"network":152,"type":16724,"fee":"21900","deadline":"62386043825","recipientAddress":"9852701708153EB74C71713F0AC7C56F5DE5670E06175954","mosaics":[{"mosaicId":"8268645399043017678","amount":"1000000"}],"message":"017A0F136CD7DAFE646DCBCA6D32A04351DBB51BAECE899AC80269A1929D646B405D4F1B98A067DEECF077"},"meta":{"hash":"071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A","merkleComponentHash":"071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A","height":"0"}}}'
      )
    })

    it('sendWebSocket(unconfirmedRemoved)のテスト', () => {
      /** モック */
      const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
      const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

      /** テスト */
      const receiveDatas = [
        Buffer.from('729872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
        Buffer.from('071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A', 'hex'),
      ]
      zeromq.sendWebSocket(receiveDatas)

      /** 検証 */
      deepStrictEqual(
        moc.mock.calls[0].arguments[0],
        '{"topic":"unconfirmedRemoved","data":{"meta":{"hash":"071F33703CC2FE3AA4AD7D13CE8657C7B2466BAF3A0954DE7444732431F4CD2A"}}}'
      )
    })
  })

  it('sendWebSocket(partialAdded)のテスト', () => {
    /** モック */
    const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
    const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

    /** テスト */
    const receiveDatas = [
      Buffer.from('709872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
      Buffer.from(
        '68010000000000001CDEC530BD0F9EBE6B7175587A888EE9D5ABF3BD74A08AC1B3CFB7A72E216594CF054893A45979E4890EAF10271190E1239B90D6A092A54A84B2946950DB530BB863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E000000000298414240B5000000000000846680860E000000B106B670926C62F5EF54153808DE2065913D3C3776464C1E7452D54982ABD68EC000000000000000600000000000000094EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD000000000198544198F9108C5C188E33D7DAF08ED104F281F28E328BEA84E8BD0000010000000000EEAFF441BA994BE780969800000000006000000000000000B863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E000000000198544198F9108C5C188E33D7DAF08ED104F281F28E328BEA84E8BD0000010000000000EEAFF441BA994BE7404B4C0000000000',
        'hex'
      ),
      Buffer.from('1AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC', 'hex'),
      Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
      Buffer.from('0000000000000000', 'hex'),
    ]
    zeromq.sendWebSocket(receiveDatas)

    /** 検証 */
    deepStrictEqual(
      moc.mock.calls[0].arguments[0],
      '{"topic":"partialAdded","data":{"transaction":{"signature":"1CDEC530BD0F9EBE6B7175587A888EE9D5ABF3BD74A08AC1B3CFB7A72E216594CF054893A45979E4890EAF10271190E1239B90D6A092A54A84B2946950DB530B","signerPublicKey":"B863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E","version":2,"network":152,"type":16961,"fee":"46400","deadline":"62386103940","transactionsHash":"B106B670926C62F5EF54153808DE2065913D3C3776464C1E7452D54982ABD68E","transactions":[{"signerPublicKey":"94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD","version":1,"network":152,"type":16724,"recipientAddress":"98F9108C5C188E33D7DAF08ED104F281F28E328BEA84E8BD","mosaics":[{"mosaicId":"16666583871264174062","amount":"10000000"}],"message":""},{"signerPublicKey":"B863173F9E4924CA5EB63BFC13689E27F603C29AD8C82615A10531329BF7A94E","version":1,"network":152,"type":16724,"recipientAddress":"98F9108C5C188E33D7DAF08ED104F281F28E328BEA84E8BD","mosaics":[{"mosaicId":"16666583871264174062","amount":"5000000"}],"message":""}],"cosignatures":[]},"meta":{"hash":"1AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC","merkleComponentHash":"0000000000000000000000000000000000000000000000000000000000000000","height":"0"}}}'
    )
  })

  it('sendWebSocket(partialRemoved)のテスト', () => {
    /** モック */
    const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
    const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

    /** テスト */
    const receiveDatas = [
      Buffer.from('719872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
      Buffer.from('1AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC', 'hex'),
    ]
    zeromq.sendWebSocket(receiveDatas)

    /** 検証 */
    deepStrictEqual(
      moc.mock.calls[0].arguments[0],
      '{"topic":"partialRemoved","data":{"meta":{"hash":"1AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC"}}}'
    )
  })

  it('sendWebSocket(cosignature)のテスト', () => {
    /** モック */
    const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
    const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

    /** テスト */
    const receiveDatas = [
      Buffer.from('639872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
      Buffer.from(
        '000000000000000094EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FDAEFB8E705294CBBDD5F439DD32B0CC704949E976FC38C953499F28C2A9EDA04A69474C33C4D892A5D98707D59378F6DE0CCDE244E2DCA2B11CFC461E0E2872021AF91B67240153B8C83B6CF5784A0EDDB259B1D45AF960AF88AF070001D80ACC',
        'hex'
      ),
    ]
    zeromq.sendWebSocket(receiveDatas)

    /** 検証 */
    deepStrictEqual(
      moc.mock.calls[0].arguments[0],
      '{"topic":"cosignature","data":{"version":"0","signerPublicKey":"94EC711522B4B32A1B6A6ED61D86D1E3EE11AFB9B912A17F8983EED3808819FD","signature":"AEFB8E705294CBBDD5F439DD32B0CC704949E976FC38C953499F28C2A9EDA04A69474C33C4D892A5D98707D59378F6DE0CCDE244E2DCA2B11CFC461E0E287202"}}'
    )
  })

  it('sendWebSocket(status)のテスト', () => {
    /** モック */
    const zeromq = new SymbolZeroMq(new WebSocket('ws://localhost'))
    const moc = mock.method(zeromq as any, 'execSendWebSocket', (_data: string) => {})

    /** テスト */
    const receiveDatas = [
      Buffer.from('739872DE7A88A74255A51CF543C4CCE7113A46EA255C7EDBEC', 'hex'),
      Buffer.from('261BE4D0F6ACC653CC5BE87C8727F46DC7198B7C3A1A0FFD8CF5A5FB8E7910C269DB83860E00000003004380', 'hex'),
    ]
    zeromq.sendWebSocket(receiveDatas)

    /** 検証 */
    deepStrictEqual(
      moc.mock.calls[0].arguments[0],
      '{"topic":"status","data":{"hash":"261BE4D0F6ACC653CC5BE87C8727F46DC7198B7C3A1A0FFD8CF5A5FB8E7910C2","code":"80430003","deadline":"62386330473"}}'
    )
  })
})
