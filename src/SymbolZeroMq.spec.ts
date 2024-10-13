import { describe, it, mock } from 'node:test'
import { Subscriber } from 'zeromq'
import { SymbolZeroMq } from './SymbolZeroMq.js'
import { WebSocket } from 'ws'

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
