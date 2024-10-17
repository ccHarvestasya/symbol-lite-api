import { describe, it, mock } from 'node:test'
import { WebSocket } from 'ws'
import { Subscriber } from 'zeromq'
import { SymbolZeroMq } from './ZeroMq.js'

const zmqSub = new Subscriber()
mock.method(zmqSub, 'connect', (tcpAddress: string) => {
  console.debug(`Mock Connecting to ${tcpAddress}`)
})

describe('SymbolZeroMqのテスト', () => {
  it('生成', () => {
    const ws = new WebSocket('localhost')
    new SymbolZeroMq(ws)
  })
})
