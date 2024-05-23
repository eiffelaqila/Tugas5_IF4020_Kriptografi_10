// Import functions encrypt and decrypt
import { encrypt, decrypt } from "../ramadhanCipher";

// Function for encryption using ECB mode
function ecbEncryptBlock(plaintextBlock, key) {
  // Encrypt message block using the key
  const ciphertextBlock = encrypt(plaintextBlock, key);
  return ciphertextBlock;
}

// Function for decryption using ECB mode
function ecbDecryptBlock(ciphertextBlock, key) {
  // Decrypt message block using the key
  const plaintextBlock = decrypt(ciphertextBlock, key);
  return plaintextBlock;
}

// Function for encrypting message using ECB mode
export function ecbEncrypt(plaintext, key) {
  /**
   * RamadhanCipher ecb-mode encryption function
   *
   * plaintext : text to be encrypted
   * key       : external key
   */
  plaintext = Buffer.from(plaintext, 'utf-8');
  let ciphertext = Buffer.alloc(0);

  if (plaintext.length % 16 > 0) {
    const padding = Buffer.alloc(16 - (plaintext.length % 16));
    plaintext = Buffer.concat([plaintext, padding]);
  }

  // Split message into 128-bit blocks
  for (let i = 0; i < plaintext.length; i += 16) {
    const plaintextBlock = plaintext.slice(i, i + 16);
    // Encrypt each message block and add to ciphertext
    const ciphertextBlock = ecbEncryptBlock(plaintextBlock, Buffer.from(key, 'hex'));
    ciphertext = Buffer.concat([ciphertext, ciphertextBlock]);
  }

  return ciphertext.toString('hex');
}

// Function for decrypting message using ECB mode
export function ecbDecrypt(ciphertext, key) {
  /**
   * RamadhanCipher ecb-mode decryption function
   *
   * ciphertext : text (in hex) to be decrypted
   * key        : external key
   */
  ciphertext = Buffer.from(ciphertext, 'hex');
  let plaintext = Buffer.alloc(0);

  // Split ciphertext into 128-bit blocks
  for (let i = 0; i < ciphertext.length; i += 16) {
    const ciphertextBlock = ciphertext.slice(i, i + 16);
    // Decrypt each ciphertext block and add to plaintext
    const plaintextBlock = ecbDecryptBlock(ciphertextBlock, Buffer.from(key, 'hex'));
    plaintext = Buffer.concat([plaintext, plaintextBlock]);
  }

  // Remove padding
  plaintext = plaintext.toString().replace(/\x00+$/, '');
  return plaintext;
}

// module.exports = {
//   ecbEncrypt,
//   ecbDecrypt
// };