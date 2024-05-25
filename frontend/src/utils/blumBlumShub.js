export default class BlumBlumShub {
    constructor(p, q, seed) {
        if (!this.isPrime(p) || !this.isPrime(q) || p % 4n !== 3n || q % 4n !== 3n) {
            throw new Error("p and q must be prime numbers congruent to 3 mod 4.");
        }
        this.n = p * q;
        this.state = seed % this.n;
    }

    isPrime(num) {
        if (num <= 1n) return false;
        if (num <= 3n) return true;

        if (num % 2n === 0n || num % 3n === 0n) return false;

        for (let i = 5n; i * i <= num; i += 6n) {
            if (num % i === 0n || num % (i + 2n) === 0n) return false;
        }

        return true;
    }

    nextBit() {
        this.state = (this.state * this.state) % this.n;
        return this.state & 1n;
    }

    nextBits(length) {
        let bits = 0n;
        for (let i = 0n; i < length; i++) {
            bits = (bits << 1n) | BigInt(this.nextBit());
        }
        return bits;
    }

    nextBytes(byteLength) {
        return this.nextBits(byteLength * 8);
    }
}

// // Contoh penggunaan:
// const p = 30000000091n; // Prime number p congruent to 3 mod 4
// const q = 40000000003n; // Prime number q congruent to 3 mod 4
// let seed = BigInt((new Date()).getTime()) % p*q;; // Seed value

// let bbs = new BlumBlumShub(p, q, seed);

// console.log(bbs.nextBytes(16)); // Generate 16 random bytes (128 bits) in BigInt
// console.log(bbs.nextBytes(32)); // Generate 32 random bytes (256 bits) in BigInt
// console.log(bbs.nextBits(128)); // Generate 128 random bits in BigInt
// console.log(bbs.nextBits(256));  // Generate 256 random bits in BigInt

// seed = BigInt((new Date()).getTime()) % p*q;
// bbs = new BlumBlumShub(p, q, seed);

// console.log(bbs.nextBytes(16)); // Generate 16 random bytes (128 bits) in BigInt
// console.log(bbs.nextBytes(32));