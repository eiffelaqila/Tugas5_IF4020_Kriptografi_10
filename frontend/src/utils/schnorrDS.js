import BlumBlumShub from "./blumBlumShub.js";
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

  getRandomBytes(size) {
    const p = 30000000091n;
    const q = 40000000003n;
    let seed = BigInt((new Date()).getTime()) % p*q;
    while (seed == 0 || seed == 1){
      seed = BigInt((new Date()).getTime()) % p*q;
    }

    const bbs = new BlumBlumShub(p, q, seed);
    const randomBytes = bbs.nextBytes(size);
    return randomBytes.toString(16);
  }

  generatePrivateKey() {
    let privateKey = BigInt("0x" + this.getRandomBytes(32))
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
    let r = BigInt("0x" + this.getRandomBytes(32));
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

  stringifySignature(signature) {
    return JSON.stringify({ e: signature.e.toString(), y: signature.y.toString() })
  }

  readPublicKeyFile(publicKeyFile) {
    const { p, q, a, publicKey } = JSON.parse(publicKeyFile);
    this.setGlobalPublicKey(BigInt(p), BigInt(q), BigInt(a));

    return BigInt(publicKey)
  }

  readPrivateKeyFile(privateKeyFile) {
    const { p, q, a, privateKey } = JSON.parse(privateKeyFile);
    this.setGlobalPublicKey(BigInt(p), BigInt(q), BigInt(a));

    return BigInt(privateKey)
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
// const p = BigInt("0xF56C2A7D366E3EBDEAA1891FD2A0D099436438A673FED4D75F594959CFFEBCA7BE0FC72E4FE67D91D801CBA0693AC4ED9E411B41D19E2FD1699C4390AD27D94C69C0B143F1DC88932CFE2310C886412047BD9B1C7A67F8A25909132627F51A0C866877E672E555342BDF9355347DBD43B47156B2C20BAD9D2B071BC2FDCF9757F75C168C5D9FC43131BE162A0756D1BDEC2CA0EB0E3B018A8B38D3EF2487782AEB9FBF99D8B30499C55E4F61E5C7DCEE2A2BB55BD7F75FCDF00E48F2E8356BDB59D86114028F67B8E07B127744778AFF1CF1399A4D679D92FDE7D941C5C85C5D7BFF91BA69F9489D531D1EBFA727CFDA651390F8021719FA9F7216CEB177BD75");
// const q = BigInt("0xC24ED361870B61E0D367F008F99F8A1F75525889C89DB1B673C45AF5867CB467");
// const a = BigInt("0x8DC6CC814CAE4A1C05A3E186A6FE27EABA8CDB133FDCE14A963A92E809790CBA096EAA26140550C129FA2B98C16E84236AA33BF919CD6F587E048C52666576DB6E925C6CBE9B9EC5C16020F9A44C9F1C8F7A8E611C1F6EC2513EA6AA0B8D0F72FED73CA37DF240DB57BBB27431D618697B9E771B0B301D5DF05955425061A30DC6D33BB6D2A32BD0A75A0A71D2184F506372ABF84A56AEEEA8EB693BF29A640345FA1298A16E85421B2208D00068A5A42915F82CF0B858C8FA39D43D704B6927E0B2F916304E86FB6A1B487F07D8139E428BB096C6D67A76EC0B8D4EF274B8A2CF556D279AD267CCEF5AF477AFED029F485B5597739F5D0240F67C2D948A6279");

// const message = "Hello, world!";
// const schnorrDS = new SchnorrDS();

// const {s, v} = schnorrDS.generateKeyPair(p, q, a);
// const signature = schnorrDS.signMessage(s, message);
// const isValid = schnorrDS.verifySignature(v, message, signature)

// console.log("Private Key:\t", s);
// console.log("Public Key:\t", v);
// console.log("Signature:", signature)
// console.log("Is valid?", isValid);
