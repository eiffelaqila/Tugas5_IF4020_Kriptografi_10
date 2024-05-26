import keyExpansion from "./keyExpansion.js";

const IP = [
    57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7,
    56, 48, 40, 32, 24, 16, 8, 0, 58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6,
    121, 113, 105, 97, 89, 81, 73, 65, 123, 115, 107, 99, 91, 83, 75, 67,
    125, 117, 109, 101, 93, 85, 77, 69, 127, 119, 111, 103, 95, 87, 79, 71,
    120, 112, 104, 96, 88, 80, 72, 64, 122, 114, 106, 98, 90, 82, 74, 66,
    124, 116, 108, 100, 92, 84, 76, 68, 126, 118, 110, 102, 94, 86, 78, 70,
];

const INVERSE_IP = [
    39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25, 32, 0, 40, 8, 48, 16, 56, 24,
    103, 71, 111, 79, 119, 87, 127, 95, 102, 70, 110, 78, 118, 86, 126, 94,
    101, 69, 109, 77, 117, 85, 125, 93, 100, 68, 108, 76, 116, 84, 124, 92,
    99, 67, 107, 75, 115, 83, 123, 91, 98, 66, 106, 74, 114, 82, 122, 90,
    97, 65, 105, 73, 113, 81, 121, 89, 96, 64, 104, 72, 112, 80, 120, 88
];

const S_BOXES = [
    [6, 11, 10, 15, 9, 0, 13, 12, 4, 5, 7, 2, 1, 3, 8, 14],
    [10, 12, 2, 5, 15, 13, 3, 7, 9, 11, 0, 6, 4, 8, 1, 14],
    [14, 4, 0, 13, 5, 2, 8, 6, 15, 9, 7, 1, 10, 12, 3, 11],
    [14, 6, 8, 0, 15, 11, 5, 3, 1, 10, 7, 12, 4, 2, 13, 9],
    [8, 14, 10, 5, 13, 9, 0, 3, 15, 1, 6, 12, 2, 7, 4, 11],
    [13, 11, 0, 6, 14, 2, 3, 8, 12, 5, 15, 10, 4, 1, 9, 7],
    [3, 8, 10, 12, 0, 1, 13, 7, 4, 6, 2, 14, 11, 15, 5, 9],
    [0, 13, 4, 8, 3, 7, 6, 14, 11, 2, 10, 5, 9, 1, 12, 15],
    [6, 0, 5, 3, 2, 15, 14, 4, 11, 8, 13, 7, 9, 1, 10, 12],
    [4, 13, 12, 10, 5, 1, 3, 9, 15, 14, 8, 6, 0, 7, 2, 11],
    [1, 12, 8, 2, 6, 7, 14, 10, 5, 4, 9, 0, 13, 15, 11, 3],
    [6, 11, 13, 15, 2, 5, 12, 3, 7, 14, 10, 9, 0, 4, 8, 1],
    [0, 4, 2, 12, 6, 1, 14, 7, 13, 3, 5, 11, 10, 9, 15, 8],
    [8, 15, 11, 7, 14, 10, 0, 1, 3, 13, 12, 6, 9, 2, 4, 5],
    [5, 7, 14, 1, 13, 0, 3, 2, 9, 10, 6, 11, 15, 12, 8, 4],
    [13, 2, 0, 5, 3, 12, 1, 4, 11, 15, 14, 7, 6, 9, 10, 8],
];

const P_BOX = [
    47, 12, 55, 18, 13, 2, 51, 42, 32, 35, 52, 26, 44, 58, 41, 25,
    50, 27, 60, 3, 37, 21, 59, 38, 63, 6, 46, 17, 45, 22, 33, 29,
    8, 61, 9, 62, 49, 10, 48, 53, 57, 54, 14, 24, 56, 20, 16, 1,
    39, 11, 19, 4, 34, 30, 43, 40, 15, 36, 0, 5, 23, 28, 7, 31
];

function keyGenerator(key) {
    const rounds = 16;
    const length = 8;
    const expandedKey = keyExpansion(key, rounds, length);
    const keys = [];
    for (let i = 0; i < expandedKey.length; i += length) {
        keys.push(expandedKey.slice(i, i + length));
    }
    return keys;
}

function bytesToBitArray(bytes) {
    const bitArray = new Array(bytes.length * 8);
    for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        for (let bit = 0; bit < 8; bit++) {
            bitArray[i * 8 + bit] = (byte >> (7 - bit)) & 1;
        }
    }
    return bitArray;
}

function bitArrayToBytes(bitArray) {
    const bytes = new Uint8Array(bitArray.length / 8);
    for (let i = 0; i < bytes.length; i++) {
        let byte = 0;
        for (let bit = 0; bit < 8; bit++) {
            byte |= bitArray[i * 8 + bit] << (7 - bit);
        }
        bytes[i] = byte;
    }
    return bytes;
}

function f(subbitarray, internalKey) {
    const tempArray = new Uint8Array(subbitarray.length / 8);
    for (let i = 0; i < subbitarray.length; i += 8) {
        const byte = parseInt(subbitarray.slice(i, i + 8).join(''), 2);
        tempArray[i / 8] = byte ^ 'RAMADHAN'.charCodeAt(i / 8) ^ internalKey[i / 8];
    }

    const processedArray = [];
    for (let byte of tempArray) {
        processedArray.push((byte >> 4) & 0b1111);
        processedArray.push(byte & 0b1111);
    }

    const matrix = Array.from({ length: 4 }, () => []);
    for (let i = 0; i < 16; i++) {
        matrix[Math.floor(i / 4)].push(S_BOXES[i][processedArray[i]]);
    }

    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = [...matrix[i].slice(i), ...matrix[i].slice(0, i)];
    }

    const flattenMatrixBitArray = [];
    for (let row of matrix) {
        for (let num of row) {
            const bits = num.toString(2).padStart(4, '0');
            for (let bit of bits) {
                flattenMatrixBitArray.push(parseInt(bit, 10));
            }
        }
    }

    return P_BOX.map(index => flattenMatrixBitArray[index]);
}

function iterationEncrypt(plainBitArray, internalKeys) {
    let L = plainBitArray.slice(0, 64);
    let R = plainBitArray.slice(64);

    for (let i = 0; i < 16; i++) {
        const fResult = f(L, internalKeys[i]);
        const temp = L;
        L = R.map((bit, index) => bit ^ fResult[index]);
        R = temp;
    }

    return R.concat(L);
}

function iterationDecrypt(cipherBitArray, internalKeys) {
    let L = cipherBitArray.slice(0, 64);
    let R = cipherBitArray.slice(64);

    for (let i = 15; i >= 0; i--) {
        const fResult = f(L, internalKeys[i]);
        const temp = L;
        L = R.map((bit, index) => bit ^ fResult[index]);
        R = temp;
    }

    return R.concat(L);
}

export function encrypt(plainBytes, key) {
    const plainBits = bytesToBitArray(plainBytes);
    const internalKeys = keyGenerator(key);

    const initialPermutation = IP.map(index => plainBits[index]);
    const iterationResult = iterationEncrypt(initialPermutation, internalKeys);
    const inversePermutation = INVERSE_IP.map(index => iterationResult[index]);

    return bitArrayToBytes(inversePermutation);
}

export function decrypt(cipherBytes, key) {
    const cipherBits = bytesToBitArray(cipherBytes);
    const internalKeys = keyGenerator(key);

    const initialPermutation = IP.map(index => cipherBits[index]);
    const iterationResult = iterationDecrypt(initialPermutation, internalKeys);
    const inversePermutation = INVERSE_IP.map(index => iterationResult[index]);

    return bitArrayToBytes(inversePermutation);
}
