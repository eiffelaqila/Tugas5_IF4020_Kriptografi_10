def bytes_to_bitarray(bytes):
    return [int(i) for byte in bytes for i in format(byte, '08b')]

def bitarray_to_bytes(bitarray):
    return bytes(int(''.join(map(str, bitarray[i:i+8])), 2) for i in range(0, len(bitarray), 8))
