import zmq from 'zeromq'

export class SymbolZeroMq {
  public async connectZeroMq(host: string = 'localhost', port: number = 7902) {
    const socket = new zmq.Subscriber()

    console.log(`Connecting to ${host}:${port}`)
    socket.connect(`tcp://${host}:${port}`)

    const blockMarker = Buffer.from(Buffer.from('9FF2D8E480CA6A49', 'hex').toReversed())
    const finalizedMarker = Buffer.from(Buffer.from('4D4832A031CE7954', 'hex').toReversed())
    const dropMarker = Buffer.from(Buffer.from('5C20D68AEE25B0B0', 'hex').toReversed())

    socket.subscribe(blockMarker)
    socket.subscribe(finalizedMarker)
    socket.subscribe(dropMarker)

    const transactionMarker = Buffer.from('3D', 'hex')
    const transactionStatusMarker = Buffer.from('49', 'hex')
    const utAddMarker = Buffer.from('4B', 'hex')
    const utDelMarker = Buffer.from('48', 'hex')

    socket.subscribe(transactionMarker)
    socket.subscribe(transactionStatusMarker)
    socket.subscribe(utAddMarker)
    socket.subscribe(utDelMarker)

    for await (const [topic, msg] of socket) {
      console.log('received a message related to:', topic, 'containing message:', msg)
    }

    // facade = SymbolFacade('mainnet')

    // while True:
    // 	topic = socket.recv()
    // 	if block_marker == topic:
    // 		block_header = socket.recv()
    // 		entity_hash = Hash256(socket.recv())
    // 		generation_hash = Hash256(socket.recv())
    // 		header = BlockFactory.deserialize(block_header)
    // 		print(f'block height: {header.height} ({header.height.value}) entity_hash {entity_hash} generation_hash {generation_hash}')
    // 		print(f'block harvested by: {header.signer_public_key} {facade.network.public_key_to_address(header.signer_public_key)}')
    // 		print(f'block transactions: {header.transactions}')
    // 	elif finalized_marker == topic:
    // 		body_part_1 = socket.recv()
    // 		finalization_round = int.from_bytes(body_part_1[0:8], byteorder='little')
    // 		finalizated_height = int.from_bytes(body_part_1[8:16], byteorder='little')
    // 		entity_hash =  Hash256(body_part_1[16:])
    // 		print(f'FINALIZED height: {finalization_round} ({finalizated_height}) entity_hash {entity_hash}')
    // 	elif drop_marker == topic:
    // 		body_part_1 = socket.recv()
    // 		height = int.from_bytes(body_part_1[0:8], byteorder='little')
    // 		print(f'drop after height: {height}')
    // 	elif ut_add_marker[0] == topic[0] or transaction_marker[0] == topic[0]:  # mind [0]
    // 		message = 'UT add' if ut_add_marker[0] == topic[0] else 'transaction add'
    // 		# rest of the topic contains address
    // 		address = SymbolFacade.Address(topic[1:])
    // 		transaction = socket.recv()
    // 		entity_hash = Hash256(socket.recv())
    // 		merkle_component_hash = Hash256(socket.recv())
    // 		body_part_1 = socket.recv()
    // 		height = int.from_bytes(body_part_1[0:8], byteorder='little')
    // 		print(f'{message} {address} {entity_hash} {height}')
    // 	elif ut_del_marker[0] == topic[0]:  # mind [0]:
    // 		entity_hash = Hash256(socket.recv())
    // 		print(f'UT del {entity_hash} {height}')
    // 	else:
    // 		print(f'unknown [ {len(topic)} {topic} ]')
  }
}
