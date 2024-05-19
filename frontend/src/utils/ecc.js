/* eslint-disable no-unused-vars */

/**
 * ECC (Elliptic Curve Cryptography) utility functions
 */

/**
 * @description Count gradient of the line PQ in the Galois field (mod p)
 * @param {{x: number, y: number}} p point P
 * @param {{x: number, y: number}} q point Q
 * @param {number} n (mod p)
 * @returns {number}
 */
export const gradient = (p, q, n) => {
  const x = q.x - p.x;
  const y = q.y - p.y;
  for (let i = 1; i < n; i++) {
    if ((y * i) % n === 1) {
      return i % n;
    }
  }
};

/**
 * @description Count the R of P + Q = R inside the Galois field (mod p)
 * @param {{x: number, y: number}} p point P
 * @param {{x: number, y: number}} q point Q
 * @param {number} n (mod p)
 * @returns {{x: number, y: number}}
 */
export const pointAddition = (p, q, n) => {
  const m = gradient(p, q, n);
  let xr = (Math.pow(m, 2) - p.x - q.x) % n;
  let yr = (m * (p.x - xr) - p.y) % n;
  return { xr, yr };
};

/**
 * @description Count the R of P - Q = R inside the Galois field (mod p)
 * @param {{x: number, y: number}} p point P
 * @param {{x: number, y: number}} q point Q
 * @param {number} n (mod p)
 * @returns {{x: number, y: number}}
 */
export const pointSubstraction = (p, q, n) => {
  const m = gradient(p, q, n);
  const minQ = { x: q.x, y: -q.y };
  const xr = Math.pow(m, 2) - p.x - (minQ.x % n);
  const yr = m * (p.x - xr) - (p.y % n);
  return { xr, yr };
};

/**
 * @description Point doubling (P + P = 2P = R)
 * @param {{x: number, y: number}} p point P
 * @param {number} a x coefficient
 * @param {number} n (mod p)
 * @returns {{x: number, y: number}}
 */
export const pointDoubling = (p, a, n) => {
  if (p.y === 0) {
    return { x: 0, y: 0 };
  }

  const m = (3 * Math.pow(p.x, 2) + a) % n;
  const xr = Math.pow(m, 2) - ((2 * p.x) % n);
  const yr = m * (p.x - xr) - (p.y % n);
  return { xr, yr };
};

/**
 * @description Point iteration (P^k = kP = P + P + ... + P)
 * @param {{x: number, y: number}} p
 * @param {number} k
 * @returns {{x: number, y: number}}
 */
export const pointIteration = (p, k) => {
  // TODO: test this function
  let result = { x: 0, y: 0 };
  for (let i = 0; i < k; i++) {
    result = pointAddition(result, p); // this can be optimized
  }
  return result;
};

/**
 * @description List all points in the elliptic curve y^2 ≡ x^3 + ax + b (mod p) in the Galois field
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {{x: number, y: number}[]}
 */
export const listPoints = (a, b, p) => {
  const points = [];
  for (let x = 0; x < p; x++) {
    // count if y^2 ≡ x^3 + ax + b (mod p)
    const y2 = Math.pow(x, 3) + a * x + b;
    for (let y = 0; y < p; y++) {
      if (Math.pow(y, 2) % p === y2 % p) {
        points.push({ x, y });
      }
    }
  }
  return points;
};
