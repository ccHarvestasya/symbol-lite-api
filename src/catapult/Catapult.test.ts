/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock } from 'node:test'
import { Catapult } from './Catapult.js'
import assert from 'node:assert'
import { utils } from 'symbol-sdk'
import { ChainInfo } from './model/Chain.js'

describe('Catapultのテスト', () => {
  it('getChainInfoのテスト', async () => {
    const catapult = new Catapult('cert', '')

    /** モック */
    mock.method(catapult as any, 'request', (packetType: number): Uint8Array | undefined => {
      let data: Uint8Array | undefined
      if (packetType === 5) {
        data = utils.hexToUint8('49781b000000000038781b00000000000000000000000000b22297a5530349ff')
      } else if (packetType === 306) {
        data = utils.hexToUint8(
          'c60900001200000038781b0000000000cd55a59845d78229f1397b295aa850d4eba9a45caae7e0dcdddc9b7d3769a719'
        )
      } else {
        console.error(packetType)
      }
      return data
    })

    /** テスト */
    let res: ChainInfo | undefined
    let error: unknown | undefined
    try {
      res = await catapult.getChainInfo()
    } catch (e) {
      error = e
    }

    /** 検証 */
    assert.ok(!error)
    assert.ok(res)
    assert.equal(res.height, '1800265')
    assert.equal(res.scoreHigh, '0')
    assert.equal(res.scoreLow, '18395237810766815922')
    assert.equal(res.latestFinalizedBlock.finalizationEpoch, 2502)
    assert.equal(res.latestFinalizedBlock.finalizationPoint, 18)
    assert.equal(res.latestFinalizedBlock.height, '1800248')
    assert.equal(res.latestFinalizedBlock.hash, 'CD55A59845D78229F1397B295AA850D4EBA9A45CAAE7E0DCDDDC9B7D3769A719')
  })
})
