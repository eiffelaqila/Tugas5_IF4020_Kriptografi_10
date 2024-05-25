class BlumBlumShub {
    constructor(p, q, seed) {
        if (!this.isPrime(p) || !this.isPrime(q) || p % 4 !== 3 || q % 4 !== 3) {
            throw new Error("p and q must be prime numbers congruent to 3 mod 4.");
        }
        this.n = p * q;
        this.state = seed % this.n;
    }

    isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;

        if (num % 2 === 0 || num % 3 === 0) return false;

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }

        return true;
    }

    nextBit() {
        this.state = (this.state * this.state) % this.n;
        return this.state & 1;
    }

    nextBits(length) {
        let bits = 0n;
        for (let i = 0; i < length; i++) {
            bits = (bits << 1n) | BigInt(this.nextBit());
        }
        return bits;
    }

    nextBytes(byteLength) {
        return this.nextBits(byteLength * 8);
    }
}

// // Contoh penggunaan:
// const p = 11; // Prime number p congruent to 3 mod 4
// const q = 19; // Prime number q congruent to 3 mod 4
// const seed = 3; // Seed value

// const bbs = new BlumBlumShub(p, q, seed);

// console.log(bbs.nextBytes(16)); // Generate 16 random bytes (128 bits) in BigInt
// console.log(bbs.nextBytes(32)); // Generate 32 random bytes (256 bits) in BigInt
// console.log(bbs.nextBits(128)); // Generate 128 random bits in BigInt
// console.log(bbs.nextBits(256));  // Generate 256 random bits in BigInt