import { useState } from 'react';
import { decodeMessage, decryptPoints, encodeMessage, encryptPoints } from '../utils/ecc';

const useE2EE = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  /**
   * @param {string} message
   * @returns {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]}
   */
  const e2eeEncrypt = (message) => {
    const encoded = encodeMessage(message);
    const encrypted = encryptPoints(encoded, publicKey);
    return encrypted;
  }

  /**
   * @param {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]} data
   * @returns {string}
   */
  const e2eeDecrypt = (data) => {
    console.log('e2eeDecrypt input:', data);
    const decrypted = decryptPoints(data, privateKey);
    const decoded = decodeMessage(decrypted);
    return decoded;
  }

  return {
    privateKey, publicKey,
    setPublicKey, setPrivateKey,
    e2eeEncrypt, e2eeDecrypt
  };
}
export default useE2EE;