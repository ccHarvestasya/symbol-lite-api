/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock } from 'node:test'
import { Catapult } from './Catapult.js'
import assert from 'node:assert'
import { utils } from 'symbol-sdk'

describe('Catapultのテスト', () => {
  it('getChainInfoのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 0x0_05) {
        data = utils.hexToUint8('49781b000000000038781b00000000000000000000000000b22297a5530349ff')
      } else if (packetType === 0x1_32) {
        data = utils.hexToUint8(
          'c60900001200000038781b0000000000cd55a59845d78229f1397b295aa850d4eba9a45caae7e0dcdddc9b7d3769a719'
        )
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    const res = await catapult.getChainInfo()

    /** 検証 */
    assert.ok(res)
    assert.equal(res.height, '1800265')
    assert.equal(res.scoreHigh, '0')
    assert.equal(res.scoreLow, '18395237810766815922')
    assert.equal(res.latestFinalizedBlock.finalizationEpoch, 2502)
    assert.equal(res.latestFinalizedBlock.finalizationPoint, 18)
    assert.equal(res.latestFinalizedBlock.height, '1800248')
    assert.equal(res.latestFinalizedBlock.hash, 'CD55A59845D78229F1397B295AA850D4EBA9A45CAAE7E0DCDDDC9B7D3769A719')
  })

  it('getNodeInfoのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 0x1_11) {
        data = utils.hexToUint8(
          '8a000000070300013a4ce490cd8f08207de855394e72826425949aa893ab0ca220ca7ac920872bf749d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a401000000dc1e98152473616b69612e68617276657374617379612e636f6d53616b6961486172766573746173796153796d626f6c4e6f64652f546573744e65742f2e'
        )
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    const res = await catapult.getNodeInfo()

    /** 検証 */
    assert.ok(res)
    assert.equal(res.version, 16777991)
    assert.equal(res.publicKey, '3A4CE490CD8F08207DE855394E72826425949AA893AB0CA220CA7AC920872BF7')
    assert.equal(res.networkGenerationHashSeed, '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4')
    assert.equal(res.roles, 1)
    assert.equal(res.port, 7900)
    assert.equal(res.networkIdentifier, 152)
    assert.equal(res.host, 'sakia.harvestasya.com')
    assert.equal(res.friendlyName, 'SakiaHarvestasyaSymbolNode/TestNet/.')
  })

  it('getNodePeersのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 0x1_13) {
        data = utils.hexToUint8(
          '9c000000070300018f9a40918af946d49b98b5d0e332845e5a3e860b13541682f1d33d2661fe725149d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e982c1f32302e34382e39322e31323420232055736520796f757220646f6d61696e206f72204950206164647265737370682d766d20232043686f6f7365206120707265666572726564206e616d6578000000070300018620e04adae85cd455b524a16bba8d759568f33e9b924f91692f97aef9949fe249d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e981611746573746e6574322e7368697a75696c61622e636f6d69626f6e653632407368697a75696c61625800000007030001f6009f0158cedc8311981ee21252aa7f01ff3998555f1ac3e1c20c50ac8aca8149d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a401000000dc1e980502746b6c6162544b7800000000000000c1773740461c97ff172e966213716e089a93dc43f10be55dc27cc49cba67e69249d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e981b0c3430312d7361692d6475616c2e73796d626f6c746573742e6e65743430312d7361692d6475616c8800000000000000bf61564c09b8a44a940eb09b9d062020a39ba848bab838d597f27b11f1fbe71749d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e981b1c73796d2d746573742d30312e6f70656e696e672d6c696e652e6a7073796d2d746573742d30312e6f70656e696e672d6c696e652e6a702e7500000000000000ceaae51c6d294aefc1a3c84fefe9d60b0ce815dbc66567211a41b7de2dc164b849d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e98190b746573746e6574312e73796d626f6c2d6d696b756e2e6e65746d696b756e5f74657374316600000000000000119c3736d185d00ad0ca6101e21408f009fb49b410d3b7548509bd7f2b413d8e49d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e980e0731332e3131332e3132342e32333531313943333733750000000000000024a1c604daab6d23ce19bd00ff272a87382b019addea99193f15e469b564608049d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e981b09766d693833313832382e636f6e7461626f7365727665722e6e65744d414d45534849424176000000000000008a66bdb319c210b5c37c908c5379db7f98bac8fcf4faf2947ee19ace30e6934349d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e980d18322e647573616e6a702e636f6d647573616e6a7032407361695f66616b65766f74696e67357800000000000000a167b5437685f87927efb52a32faf7b610d264b8526e7ed07c5070ea107bc3d449d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e9810176e6f64652d742e73697869732e78797a53697869734e6f64652053796d626f6c546573746e65747d0000000000000003a9ef5a45c8d4d059d3e9c95dc5956091e3e855dc812f363db41d987bf927a649d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e9813197465737430322e78796d6e6f6465732e636f6d74657374206e6f646530322066726f6d2078796d6e6f6465737500000007030001d20c4bfce4aa22d8c9fdc5952ba36f41ee2226241362a963223a077fb194219249d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e98190b746573746e6574322e73796d626f6c2d6d696b756e2e6e65746d696b756e5f74657374326000000007030001e31806d8d180de025529095e90d792f8c492f628e293c628a2dd8a231284172149d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a401000000dc1e98040b6f6e656d6f6e656d5f6d6f62696c656400000007030001a08d3472c321918f07a2eb783152d72a9c6bd26bcc303d38174465f4ffa5636649d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e980c0735342e3232372e37392e34316f66666c696e658800000007030001154a2b669bde15924ff6fee9ecb9cdd79eeada4131665748a12132eaa465e57549d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e981b1c73796d2d746573742d30332e6f70656e696e672d6c696e652e6a7073796d2d746573742d30332e6f70656e696e672d6c696e652e6a702e620000000703000168c41450881711cd32feb0935d3cdbc6c08c7e83f3d958660d8ed8ffc7ef00f249d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dd1e980a07332e3131332e302e3232363843343134357800000007030001645e2e56b5f8680b69bc0255f4930169dbc052bb25f8121055de2072d37e2c3049d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e981b0c3230312d7361692d6475616c2e73796d626f6c746573742e6e65743230312d7361692d6475616c780000000000000007d38bae29464c1f54cc1c8202dd83b65af21c8e5ff1fb01aceee2243c55ef2a49d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a407000000dc1e981b0c3030312d7361692d6475616c2e73796d626f6c746573742e6e65743030312d7361692d6475616c6b000000070300014540b7010550caa12f78dd3466a2645212f705f39e25a2333e9cb12dff1a91a049d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a405000000dc1e980e0c34742e647573616e6a702e636f6d70656572766f74696e6740346a00000007030001d1f9b06b72d66098defd8dcd85dfb1849ec11a059b60441f83f770813483933149d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a406000000dc1e980e0b35742e647573616e6a702e636f6d617069766f74696e6740357900000007030001cc1287250b978c0638fd0461eb86952baeab4f04266a09fdb3d96d5412bd5b5749d6e1ce276a85b70eafe52349aacca389302e7a9754bcf1221e79494fc665a403000000dc1e98141473796d626f6c2d617a7572652e303030392e636f73796d626f6c2d617a7572652e303030392e636f'
        )
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    const res = await catapult.getNodePeers()

    /** 検証 */
    assert.ok(res)
    assert.equal(res.nodePeers[0].version, 16777991)
    assert.equal(res.nodePeers[0].publicKey, '8F9A40918AF946D49B98B5D0E332845E5A3E860B13541682F1D33D2661FE7251')
    assert.equal(
      res.nodePeers[0].networkGenerationHashSeed,
      '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4'
    )
    assert.equal(res.nodePeers[0].roles, 3)
    assert.equal(res.nodePeers[0].port, 7900)
    assert.equal(res.nodePeers[0].networkIdentifier, 152)
    assert.equal(res.nodePeers[0].host, '20.48.92.124 # Use your domain or IP address')
    assert.equal(res.nodePeers[0].friendlyName, 'ph-vm # Choose a preferred name')
  })

  it('getNodeTimeのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 0x1_20) {
        data = utils.hexToUint8('12deea570e00000010deea570e000000')
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    const res = await catapult.getNodeTime()

    /** 検証 */
    assert.ok(res)
    assert.equal(res.sendTimestamp, 61604552210)
    assert.equal(res.receiveTimestamp, 61604552208)
  })

  it('getNodeUnlockedAccountのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 0x3_04) {
        data = utils.hexToUint8(
          '22ce1a6a3b8ae2dea7e56cc76b544120113c27e03eec51c3f0f8d266e72ce73a7ae030aa4da550a1c9b714aa1ade789c4fd7e2b16c1d3c04420dd261c5dfbfdc'
        )
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    const res = await catapult.getNodeUnlockedAccount()

    /** 検証 */
    assert.ok(res)
    assert.equal(res.unlockedAccount[0], '22CE1A6A3B8AE2DEA7E56CC76B544120113C27E03EEC51C3F0F8D266E72CE73A')
    assert.equal(res.unlockedAccount[1], '7AE030AA4DA550A1C9B714AA1ADE789C4FD7E2B16C1D3C04420DD261C5DFBFDC')
  })
})
