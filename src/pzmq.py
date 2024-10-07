import zmq
from binascii import hexlify as h, unhexlify as u

from symbolchain.facade.SymbolFacade import SymbolFacade
from symbolchain.CryptoTypes import Hash256
from symbolchain.sc import BlockFactory

context = zmq.Context()

#  Socket to talk to server
print('Connecting to server…')
socket = context.socket(zmq.SUB)
socket.connect('tcp://localhost:7902')

block_marker = u('9FF2D8E480CA6A49')[::-1]
finalized_marker = u('4D4832A031CE7954')[::-1]
drop_marker = u('5C20D68AEE25B0B0')[::-1]

socket.setsockopt(zmq.SUBSCRIBE, block_marker)
socket.setsockopt(zmq.SUBSCRIBE, finalized_marker)
socket.setsockopt(zmq.SUBSCRIBE, drop_marker)

transaction_marker = b'a'
transaction_status_marker = b's'  # 0x73
ut_add_marker = b'u'  # 0x75
ut_del_marker = b'r'  # 0x72

socket.setsockopt(zmq.SUBSCRIBE, transaction_marker)
socket.setsockopt(zmq.SUBSCRIBE, transaction_status_marker)
socket.setsockopt(zmq.SUBSCRIBE, ut_add_marker)
socket.setsockopt(zmq.SUBSCRIBE, ut_del_marker)

facade = SymbolFacade('mainnet')

while True:
	topic = socket.recv()
	if block_marker == topic:
		block_header = socket.recv()
		print( block_header)
		print(len( block_header))
		entity_hash = Hash256(socket.recv())
		generation_hash = Hash256(socket.recv())
		header = BlockFactory.deserialize(block_header)
		print(f'block height: {header.height} ({header.height.value}) entity_hash {entity_hash} generation_hash {generation_hash}')
		print(f'block harvested by: {header.signer_public_key} {facade.network.public_key_to_address(header.signer_public_key)}')
		print(f'block transactions: {header.transactions}')
	elif finalized_marker == topic:
		body_part_1 = socket.recv()
		finalization_round = int.from_bytes(body_part_1[0:8], byteorder='little')
		finalizated_height = int.from_bytes(body_part_1[8:16], byteorder='little')
		entity_hash =  Hash256(body_part_1[16:])
		print(f'FINALIZED height: {finalization_round} ({finalizated_height}) entity_hash {entity_hash}')
	elif drop_marker == topic:
		body_part_1 = socket.recv()
		height = int.from_bytes(body_part_1[0:8], byteorder='little')
		print(f'drop after height: {height}')
	elif ut_add_marker[0] == topic[0] or transaction_marker[0] == topic[0]:  # mind [0]
		message = 'UT add' if ut_add_marker[0] == topic[0] else 'transaction add'
		# rest of the topic contains address
		address = SymbolFacade.Address(topic[1:])
		transaction = socket.recv()
		entity_hash = Hash256(socket.recv())
		merkle_component_hash = Hash256(socket.recv())
		body_part_1 = socket.recv()
		height = int.from_bytes(body_part_1[0:8], byteorder='little')
		print(f'{message} {address} {entity_hash} {height}')
	elif ut_del_marker[0] == topic[0]:  # mind [0]:
		entity_hash = Hash256(socket.recv())
		print(f'UT del {entity_hash} {height}')
	else:
		print(f'unknown [ {len(topic)} {topic} ]')