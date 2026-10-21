import {
  generateKeys,
  signDocument,
  verifyDocument,
  encapsulateSecret,
  decapsulateSecret
} from '../src/services/pqc.js';

import assert from 'node:assert/strict';

const document = 'PQC Secure Vault test document';

console.log('\n1. Testing ML-KEM-768');

const kemKeys = generateKeys('ML-KEM-768');

const { cipherText, sharedSecret } =
  encapsulateSecret(kemKeys.publicKey);

const recoveredSecret = decapsulateSecret(
  cipherText,
  kemKeys.secretKey
);

assert.deepEqual(recoveredSecret, sharedSecret);

console.log('ML-KEM shared-secret test: PASSED');

console.log('\n2. Testing ML-DSA-65');

const mldsaKeys = generateKeys('ML-DSA-65');

const mldsaSignature = signDocument(
  'ML-DSA-65',
  document,
  mldsaKeys.secretKey
);

assert.equal(
  verifyDocument(
    'ML-DSA-65',
    document,
    mldsaSignature,
    mldsaKeys.publicKey
  ),
  true
);

assert.equal(
  verifyDocument(
    'ML-DSA-65',
    document + ' modified',
    mldsaSignature,
    mldsaKeys.publicKey
  ),
  false
);

console.log('ML-DSA signature tests: PASSED');

console.log('\n3. Testing SLH-DSA-SHA2-128s');

const slhKeys = generateKeys('SLH-DSA-SHA2-128s');

const slhSignature = signDocument(
  'SLH-DSA-SHA2-128s',
  document,
  slhKeys.secretKey
);

assert.equal(
  verifyDocument(
    'SLH-DSA-SHA2-128s',
    document,
    slhSignature,
    slhKeys.publicKey
  ),
  true
);

assert.equal(
  verifyDocument(
    'SLH-DSA-SHA2-128s',
    document + ' modified',
    slhSignature,
    slhKeys.publicKey
  ),
  false
);

console.log('SLH-DSA signature tests: PASSED');

console.log('\nAll PQC tests passed!');
