import crypto from 'crypto';
import SHA3 from './sha3.js';

export default class SchnorrDS {
  constructor() {
    this.p = undefined;
    this.q = undefined;
    this.a = undefined;
  }

  modExp(base, exp, mod) {
    let result = BigInt(1);
    base = base % mod;
    while (exp > 0) {
      if (exp % BigInt(2) === BigInt(1)) {
        result = (result * base) % mod;
      }
      exp = exp >> BigInt(1);
      base = (base * base) % mod;
    }
    return result;
  }

  modInv(base, mod) {
    let m_original = mod, temp, quotient;
    let x0 = BigInt(0), x1 = BigInt(1);
  
    if (mod === BigInt(1)) return BigInt(0);
  
    while (base > BigInt(1)) {
      quotient = base / mod;
      temp = mod;

      mod = base % mod;
      base = temp;
      temp = x0;
  
      x0 = x1 - quotient * x0;
      x1 = temp;
    }
  
    if (x1 < BigInt(0)) {
      x1 += m_original;
    }
    return x1;
  }

  setGlobalPublicKey(p, q, a) {
    this.p = p;
    this.q = q;
    this.a = a;
  }

  generatePrivateKey() {
    let privateKey = BigInt("0x" + crypto.randomBytes(32).toString("hex"))
    if ((privateKey > (this.q - BigInt(1))) || (privateKey == (BigInt(0)))) {
      privateKey = privateKey % (this.q - BigInt(1)) + BigInt(1);
    }
    return privateKey;
  }

  generatePublicKey(s) {
    return this.modExp(this.modInv(this.a, this.p), s, this.p);
  }

  generateKeyPair(p, q, a) {
    this.setGlobalPublicKey(p, q, a);

    const s = this.generatePrivateKey();
    const v = this.generatePublicKey(s);
    return {s, v};
  }

  hashMessage(message) {
    return BigInt('0x' + SHA3.hash256(message));
  }

  signMessage(privateKey, message) {
    let r = BigInt("0x" + crypto.randomBytes(32).toString("hex"))
    if ((r > (this.q - BigInt(1))) || (r == (BigInt(0)))) {
      r = r % (this.q - BigInt(1)) + BigInt(1);
    }
    const x = this.modExp(this.a, r, this.p);
    const e = this.hashMessage(message + x.toString());
    const y = (r + e * privateKey) % this.q;
    return { e, y };
  }

  verifySignature(publicKey, message, signature) {
    const { e, y } = signature;
    const new_x = this.modExp(this.modExp(this.a, y, this.p) * this.modExp(publicKey, e, this.p), BigInt(1), this.p)
    const new_e = this.hashMessage(message + new_x.toString());

    return e === new_e;
  }

  getDownloadablePublicKey(publicKey) {
    return new Blob([
      JSON.stringify({
        p: this.p.toString(),
        q: this.q.toString(),
        a: this.a.toString(),
        publicKey: publicKey.toString(),
      })],
      { type: "text/plain" },
    )
  }

  getDownloadablePrivateKey(privateKey) {
    return new Blob([
      JSON.stringify({
        p: this.p.toString(),
        q: this.q.toString(),
        a: this.a.toString(),
        privateKey: privateKey.toString(),
      })],
      { type: "text/plain" },
    )
  }
}

// EXAMPLE
const p = BigInt("0x4F590D");
const q = BigInt("0x1EC7");
const a = BigInt("0xFD");

const message = "Hello, world!";
const schnorrDS = new SchnorrDS();

const {s, v} = schnorrDS.generateKeyPair(p, q, a);
const signature = schnorrDS.signMessage(s, message);
const isValid = schnorrDS.verifySignature(v, message, signature)

console.log("Private Key:\t", s);
console.log("Public Key:\t", v);
console.log("Signature:", signature)
console.log("Is valid?", isValid);
