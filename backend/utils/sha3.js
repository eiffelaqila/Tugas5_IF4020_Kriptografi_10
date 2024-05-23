class SHA3 {
    static hash224(message){
        return SHA3.keccak1600(1152, 448, message)
    }
    
    static hash256(message) {
        return SHA3.keccak1600(1088, 512, message)
    }

    static hash384(message) {
        return SHA3.keccak1600(832, 768, message);
    }

    static hash512(message) {
        return SHA3.keccak1600(576, 1024, message)
    }

    static keccak1600(r, c, M){
        const l = c / 2 // length of digest output
        let message = new TextEncoder().encode(M, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '')
        
        // padding https://crypto.stackexchange.com/questions/40511/padding-in-keccak-sha3-hashing-algorithm
        const q = (r/8) - message.length % (r/8); // byte
        if (q == 1)  {
            message += String.fromCharCode(0x86)
        } else {
            message += String.fromCharCode(0x06) + String.fromCharCode(0x00).repeat(q-2) + String.fromCharCode(0x80)
        }
        
        // Initialization
        const state = Array.from({ length: 5 }, () => Array(5).fill(0n)) // keccak state: 5x5xw (w=64 for keccak-f[1600])
        
        // absorbing phase
        const w = 64
        const blockSize = r / w * 8 // number of characters in a block
        for (let i = 0; i < message.length; i += blockSize) { // iteration for each block
            for (let j = 0; j < r/w; j++) { // iteration for each cell in a block
                const i64 = (
                    (BigInt(message.charCodeAt(i + j * 8 + 0)) << 0n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 1)) << 8n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 2)) << 16n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 3)) << 24n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 4)) << 32n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 5)) << 40n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 6)) << 48n) |
                    (BigInt(message.charCodeAt(i + j * 8 + 7)) << 56n)
                )
                const x = j % 5
                const y = Math.floor(j / 5)
                state[x][y] ^= i64                
            }
            SHA3.keccakF1600(state)
        }

        // squeezing phase
        const hash = state[0].map((_, colIndex) => state.map(row => row[colIndex])) // transpose
            .map(plane => plane.map(lane => lane.toString(16).padStart(16, '0')
            .match(/.{2}/g).reverse().join('')).join(''))
            .join('')
            .slice(0, l/4);


        return hash;
    }

    static keccakF1600(state) {
        const ROUNDS = 24
        const RC = [
            0x0000000000000001n, 0x0000000000008082n, 0x800000000000808An, 0x8000000080008000n,
            0x000000000000808Bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
            0x000000000000008An, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000An,
            0x000000008000808Bn, 0x800000000000008Bn, 0x8000000000008089n, 0x8000000000008003n,
            0x8000000000008002n, 0x8000000000000080n, 0x000000000000800An, 0x800000008000000An,
            0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
        ]

        for (let round = 0; round < ROUNDS; round++) {
            // Theta (θ) step
            const C = Array(5).fill(0n)
            const D = Array(5).fill(0n)
            for (let x = 0; x < 5; x++) {
                // C[x] = A[x,0] ⊕ A[x,1] ⊕ A[x,2] ⊕ A[x,3] ⊕ A[x,4]
                C[x] = state[x][0] ^ state[x][1] ^ state[x][2] ^ state[x][3] ^ state[x][4]
            }
            for (let x = 0; x < 5; x++) {
                // D[x] = C[x−1] ⊕ ROT(C[x+1], 1)
                D[x] = C[(x + 4) % 5] ^ ROT(C[(x+1) % 5], 1)
                for (let y = 0; y < 5; y++) {
                    // A[x,y] = A[x,y] ⊕ D[x]
                    state[x][y] ^= D[x]
                }
            }

            // Rho (ρ) and Pi (π) steps
            let [x, y] = [1, 0];
            let current = state[x][y];
            for (let t = 0; t < 24; t++) {
                const [X, Y] = [y, (2*x + 3*y) % 5];
                const tmp = state[X][Y];
                state[X][Y] = ROT(current, ((t+1)*(t+2)/2) % 64);
                current = tmp;
                [x, y] = [X, Y];
            }

            // Chi (χ) step
            for (let y=0; y<5; y++) {
                const plane = [];  // take a copy of the plane
                for (let x=0; x<5; x++) plane[x] = state[x][y];
                for (let x=0; x<5; x++) {
                    state[x][y] = (plane[x] ^ ((~plane[(x+1)%5]) & plane[(x+2)%5]));
                }
            }

            // Iota (ι) step
            state[0][0] ^= RC[round]
        }

        function ROT(a, d) {
            return BigInt.asUintN(64, a << BigInt(d) | a >> BigInt(64 - d));
        }

    }
}

// EXAMPLE
// const hash224 = SHA3.hash224('ABC')
// const hash256 = SHA3.hash256('ABC')
// const hash384 = SHA3.hash384('ABC')
// const hash512 = SHA3.hash512('ABC')
// console.log(hash224)
// console.log(hash256)
// console.log(hash384)
// console.log(hash512)

export default SHA3;