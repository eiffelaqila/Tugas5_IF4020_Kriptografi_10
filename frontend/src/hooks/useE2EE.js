import BN from "bn.js";
import { decodeMessage, decryptPoints, encodeMessage, encryptPoints } from '../utils/ecc';

const useE2EE = () => {

  const getCurrentPublicKey = () => {
    const raw = JSON.parse(localStorage.getItem('cb'));
    return {
      x: new BN(raw.x, 16),
      y: new BN(raw.y, 16)
    }
  }
  const getCurrentPrivateKey = () => {
    return new BN(JSON.parse(localStorage.getItem('cv')), 16);
  }

  /**
   * @param {string} message
   * @returns {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]}
   */
  const e2eeEncrypt = (message) => {
    // Receiver's public key
    const publicKey = getCurrentPublicKey();

    const encoded = encodeMessage(message);
    const encrypted = encryptPoints(encoded, publicKey);
    return encrypted;
  }

  /**
   * @param {string} data string like "[{\"c1\":{\"x\":\"161ff7528b899..."
   * @param {string} privateKey
   * @returns {string}
   */
  const e2eeDecrypt = (data, privateKey = getCurrentPrivateKey()) => {
    const parsed = parseCipherPoints(JSON.parse(data));
    const decrypted = decryptPoints(parsed, privateKey);
    const decoded = decodeMessage(decrypted);
    return decoded;
  }

  /**
   * @param {{c1: {x: string, y: string}, c2: {x: string, y: string}}[]} cipherPoints
   * @returns {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]}
   */
  const parseCipherPoints = (cipherPoints) => {
    return cipherPoints.map(point => ({
      c1: { x: new BN(point.c1.x, 16), y: new BN(point.c1.y, 16) },
      c2: { x: new BN(point.c2.x, 16), y: new BN(point.c2.y, 16) }
    }));
  }

  return {
    e2eeEncrypt, e2eeDecrypt
  };
}
export default useE2EE;