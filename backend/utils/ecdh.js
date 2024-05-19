import crypto from "crypto"
import BN from "bn.js"

const pCurve = {
  "secp256r1": {
    p: new BN("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16),
    a: new BN(0),
    b: new BN(7),
    G: {
      x: new BN("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16),
      y: new BN("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16)
    },
    n: new BN("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16)
  }
}

export default class ECDH {
  constructor(curve) {
    this.curve = pCurve[curve];
    this.privateKey = this.getRandomPrivateKey();
    this.publicKey = this.scalarMultiply(this.curve.G);
  }

  setPrivateKey(privateKey) {
    this.privateKey = privateKey;
    this.publicKey = this.scalarMultiply(this.curve.G);
  }

  getRandomPrivateKey() {
    let key = new BN(crypto.randomBytes(32), 16);
    while (key.cmp(this.curve.n) >= 0 || key.isZero()) {
      key = new BN(crypto.randomBytes(32), 16);
    }
    return key;
  }

  scalarMultiply(point) {
    let result = null;
    let addend = point;
    let k = this.privateKey;

    while (k.cmpn(0) > 0) {
      if (k.andln(1) === 1) {
        result = this.pointAdd(result, addend);
      }
      addend = this.pointAdd(addend, addend);
      k = k.shrn(1);
    }

    return result;
  }

  pointAdd(p, q) {
    if (!p) return q;
    if (!q) return p;

    const { x: x1, y: y1 } = p;
    const { x: x2, y: y2 } = q;

    // if P' = -P, then point is at infinity (P + (-P) = O)
    if (x1.cmp(x2) === 0 && y1.cmp(y2) !== 0) {
      return null;
    }

    let lambda;
    if (x1.cmp(x2) === 0) {
      // lambda = ((3x_p^2 + a)/2y_p) (mod p)
      lambda = ((x1.pow(new BN(2)).muln(3)).add(this.curve.a)).mul(y1.muln(2).invm(this.curve.p)).umod(this.curve.p);
    } else {
      // lambda = ((y_p - y_q)/(x_p - x_q)) (mod p)
      lambda = (y1.sub(y2)).mul(x1.sub(x2).invm(this.curve.p)).umod(this.curve.p);
    }

    const x3 = lambda.pow(new BN(2)).sub(x1).sub(x2).umod(this.curve.p);
    const y3 = lambda.mul(x1.sub(x3)).sub(y1).umod(this.curve.p);

    return { x: x3, y: y3 };
  }

  computeSharedSecret(otherPublicKey) {
    const {x, y} = otherPublicKey;
    const publicKey = { x: new BN(x, 16), y: new BN(y, 16) };

    const sharedSecret = this.scalarMultiply(publicKey, 16);
    return sharedSecret.x;
  }
}
