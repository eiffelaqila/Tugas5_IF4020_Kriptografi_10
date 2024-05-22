# Import fungsi enkripsi dan dekripsi dari cipher
from blockcipher.cipher import encrypt, decrypt

# Fungsi untuk enkripsi menggunakan mode ECB
def ecb_encrypt_block(plaintext_block: bytes, key: bytes) -> bytes:
    # Enkripsi blok pesan menggunakan kunci
    ciphertext_block = encrypt(plaintext_block, key)
    return ciphertext_block

# Fungsi untuk dekripsi menggunakan mode ECB
def ecb_decrypt_block(ciphertext_block: bytes, key: bytes) -> bytes:
    # Dekripsi blok pesan menggunakan kunci
    plaintext_block = decrypt(ciphertext_block, key)
    return plaintext_block

# Fungsi untuk enkripsi pesan menggunakan mode ECB
def ecb_encrypt(plaintext: bytes, key: str) -> bytes:
    """RamadhanCipher ecb-mode encryption function

    plaintext : text to be encrypted
    key       : external key
    """
    ciphertext = b''
    if (len(plaintext) % 16 > 0):
        plaintext = plaintext + bytes(16 - len(plaintext) % 16)

    # Membagi pesan menjadi blok-blok 128 bit
    for i in range(0, len(plaintext), 16):
        plaintext_block = plaintext[i:i+16]
        # Enkripsi setiap blok pesan dan tambahkan ke ciphertext
        ciphertext_block = ecb_encrypt_block(plaintext_block, bytes.fromhex(key))
        ciphertext += ciphertext_block
    return ciphertext

# Fungsi untuk dekripsi pesan menggunakan mode ECB
def ecb_decrypt(ciphertext: bytes, key: str) -> bytes:
    """RamadhanCipher ecb-mode encryption function

    ciphertext : text (in hex) to be decrypted
    key        : external key
    """
    plaintext = b''
    # Membagi ciphertext menjadi blok-blok 128 bit
    for i in range(0, len(ciphertext), 16):
        ciphertext_block = ciphertext[i:i+16]
        # Dekripsi setiap blok ciphertext dan tambahkan ke plaintext
        plaintext_block = ecb_decrypt_block(ciphertext_block, bytes.fromhex(key))
        plaintext += plaintext_block
    plaintext = plaintext.rstrip(b'\x00')
    return plaintext

# Test
import string
import random
import time

if __name__ == '__main__':
    plain_text = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=32))
    key = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=16))

    print("===== START ECB - RAMADHAN CIPHER TESTING =====")
    print("Plain text:\t", plain_text)
    print("Key:\t", key)

    start_time = time.time()
    encrypted_text = ecb_encrypt(bytes(plain_text, 'utf-8'), key)
    end_time = time.time()
    print("\nEncrypting...")
    print("Encrypted hex:\t", bytes.hex(encrypted_text))
    print("Time to encrypt:\t", end_time - start_time)

    start_time = time.time()
    decrypted_text = ecb_decrypt(encrypted_text, key)
    end_time = time.time()
    print("\nDecrypting...")
    print("Decrypted text:\t", decrypted_text.decode('utf-8'))
    print("Time to decrypt:\t", end_time - start_time)

    print("\nResult:\t", plain_text == decrypted_text.decode('utf-8'))
    print("===============================================")
