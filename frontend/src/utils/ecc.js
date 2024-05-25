/* eslint-disable no-unused-vars */
import BN from "bn.js";
import BlumBlumShub from "./blumBlumShub.js";
// import { pCurve } from "./ecdh";

const pCurve = {
  "secp128r1": {
    p: new BN("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF", 16),
    a: new BN("FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC", 16),
    b: new BN("E87579C11079F43DD824993C2CEE5ED3", 16),
    G: {
      x: new BN("161FF7528B899B2D0C28607CA52C5B86", 16),
      y: new BN("CF5AC8395BAFEB13C02DA292DDED7A83", 16)
    },
    n: new BN("FFFFFFFE0000000075A30D1B9038A115", 16)
  }
}

/**
 * Encode messages into points inside Elliptic Curve y^2 ≡ x^3 + ax + b (mod p) using Kolbitz
 * @param {string} s string that will be encoded
 * @return {{x: BN, y: BN}[]} array of points with length s.length
 */
export const encodeMessage = (s) => {
  let points = [];
  const p = pCurve["secp128r1"].p;
  const a = pCurve["secp128r1"].a;
  const b = pCurve["secp128r1"].b;

  for (let i = 0; i < s.length; i++){
    // karakter penyusun pesan 0,1,2,...,9
    // A,B,C,...,Z = 10,11,12,...,35
    // kodekan tiap karakter pesan menjadi nilai m
    let m = new BN(s.charCodeAt(i))
    // pilih k sebagai parameter basis, disepakati 2 pihak
    let k = 20; // TODO: Generate random k
    // untuk setiap nilai mk, nyatakan x = mk + 1, sulihi nilai x ke dalam kurva eliptik. y^2 = x^3 + ax + b (mod p). Jika x tidak ada, pilih x = mk + 1
    let j = new BN(1);
    let x = m.muln(k).add(j);
    let fx = x.pow(new BN(3)).add(a.mul(x)).add(b).umod(p);
    // cari nilai y yang memenuhi y^2 = x^3 + ax + b (mod p)
    // invers modulo p dari x^3 + ax + b
    let y = fx.pow(new BN(1, 2)).umod(p);
    points.push({ x: x, y: y });
  }
  return points;
}

/**
 * Decode points inside Elliptic Curve y^2 ≡ x^3 + ax + b (mod p) into string message using Kolbitz
 * @param {{x: BN, y: BN}[]} points
 * @return {string}
 */
export const decodeMessage = (points) => {
  let s = ''
  let k = 20
  for(let i = 0; i < points.length; i++){
    let x = new BN(points[i].x)
    let m = x.subn(1).divn(k).toNumber()
    // petakan ke:
    // A, B, ..., Z = 10, 11, ..., 35
    // a, b, ..., z = 36, 37, ..., 61
    s += String.fromCharCode(m);
  }
  return s;
}

const pointAdd = (p, q) => {
  if (!p) return q;
  if (!q) return p;
  const { x: x1, y: y1 } = p;
  const { x: x2, y: y2 } = q;

  // if P' = -P, then point is at infinity (P + (-P) = O)
  if (x1.cmp(x2) === 0 && y1.cmp(y2) !== 0) {
    return null;
  }

  let lambda;
  const curveA = pCurve["secp128r1"].a
  const curveP = pCurve["secp128r1"].p
  if (x1.cmp(x2) === 0) {
    // lambda = ((3x_p^2 + a)/2y_p) (mod p)
    lambda = ((x1.pow(new BN(2)).muln(3)).add(curveA)).mul(y1.muln(2).invm(curveP)).umod(curveP);
  } else {
    // lambda = ((y_p - y_q)/(x_p - x_q)) (mod p)
    lambda = (y1.sub(y2)).mul(x1.sub(x2).invm(curveP)).umod(curveP);
  }

  const x3 = lambda.pow(new BN(2)).sub(x1).sub(x2).umod(curveP);
  const y3 = lambda.mul(x1.sub(x3)).sub(y1).umod(curveP);

  return { x: x3, y: y3 };
}

/**
 * @param {number} k
 * @param {{x: BN, y: BN}} point
 */
const scalarMultiply = (k, point) => {
  let result = null;
  let addend = point;

  while (k.cmpn(0) > 0) {
    if (k.andln(1) === 1) {
      result = pointAdd(result, addend);
    }
    addend = pointAdd(addend, addend);
    k = k.shrn(1);
  }

  return result;
}

const getRandomBytes = (size) => {
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

export const generateRandomPrivateKey = (n) => {
  let key = new BN(getRandomBytes(n), 16);
  while (key.cmp(pCurve["secp128r1"].n) >= 0 || key.isZero()) {
    key = new BN(getRandomBytes(n), 16);
  }
  return key;
}

export const generatePublicKey = (privateKey) => {
  let result = null;
  let addend = pCurve["secp128r1"].G;
  let k = privateKey;

  while (k.cmpn(0) > 0) {
    if (k.andln(1) === 1) {
      result = pointAdd(result, addend);
    }
    addend = pointAdd(addend, addend);
    k = k.shrn(1);
  }

  return result;
}

/**
 * @param {{x: BN, y: BN}} messagePoint
 * @param {{x: BN, y: BN}} publicKey
 * @returns {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}}
 */
const encryptPoint = (messagePoint, publicKey) => {
  const k = 1; // TODO: generate random k
  const c1 = scalarMultiply(new BN(k), pCurve["secp128r1"].G);
  const c2 = pointAdd(messagePoint, scalarMultiply(new BN(k), publicKey));
  return { c1, c2 };
}

/**
 * @param {{x: BN, y: BN}[]} messagePoint
 * @param {{x: BN, y: BN}} publicKey
 * @returns {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]}
 */
export const encryptPoints = (messagePoints, publicKey) => {
  return messagePoints.map(point => encryptPoint(point, publicKey));
}

/**
 * @param {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}} cipherPoint
 * @param {BN} privateKey
 * @returns {{x: BN, y: BN}}
 */
const decryptPoint = (cipherPoint, privateKey) => {
  const k = 1; // TODO: generate random k
  // Bob mula-mula menghitung hasil kali titik c1 dengan private key-nya
  let p = scalarMultiply(privateKey, cipherPoint.c1);
  // Bob kemudian mengurangkan titik kedua dari Pc dengan hasil kali titik c1 dengan private key-nya
  let messagePoint = pointAdd(cipherPoint.c2, { x: p.x, y: p.y.neg() });

  return messagePoint;
}

/**
 * @param {{c1: {x: BN, y: BN}, c2: {x: BN, y: BN}}[]} cipherPoints
 * @param {BN} privateKey
 * @returns {{x: BN, y: BN}[]}
 */
export const decryptPoints = (cipherPoints, privateKey) => {
  return cipherPoints.map(point => decryptPoint(point, privateKey));
}

/**** TESTING GROUND */
// const priv = generateRandomPrivateKey(16);
// const pub = generatePublicKey(priv);
// console.log("Private key:", priv);
// console.log("Public key:", pub);
// const randomPoints = encodeMessage('aku');
// console.log('Random points:', randomPoints);
// const cip = encryptPoints(randomPoints, pub);
// console.log('Cipherpoints:', cip);
// const dec = decryptPoints(cip, priv);
// console.log('Decrypted:', dec);
// console.log('Decoded:', decodeMessage(dec));
// console.log('Is equal:', decodeMessage(dec) === 'aku');