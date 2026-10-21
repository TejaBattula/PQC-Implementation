import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';

import {
  slh_dsa_sha2_128s
} from '@noble/post-quantum/slh-dsa.js';

const encoder = new TextEncoder();

/**
 * Generate a key pair for the selected algorithm.
 */
export function generateKeys(algorithm) {
  switch (algorithm) {
    case 'ML-KEM-768':
      return ml_kem768.keygen();

    case 'ML-DSA-65':
      return ml_dsa65.keygen();

    case 'SLH-DSA-SHA2-128s':
      return slh_dsa_sha2_128s.keygen();

    default:
      throw new Error('Unsupported PQC algorithm');
  }
}

/**
 * Sign a document using ML-DSA or SLH-DSA.
 */
export function signDocument(algorithm, document, secretKey) {
  const message = encoder.encode(document);

  switch (algorithm) {
    case 'ML-DSA-65':
      return ml_dsa65.sign(message, secretKey);

    case 'SLH-DSA-SHA2-128s':
      return slh_dsa_sha2_128s.sign(message, secretKey);

    default:
      throw new Error(
        'Digital signatures require ML-DSA-65 or SLH-DSA-SHA2-128s'
      );
  }
}

/**
 * Verify a document's digital signature.
 */
export function verifyDocument(
  algorithm,
  document,
  signature,
  publicKey
) {
  const message = encoder.encode(document);

  switch (algorithm) {
    case 'ML-DSA-65':
      return ml_dsa65.verify(signature, message, publicKey);

    case 'SLH-DSA-SHA2-128s':
      return slh_dsa_sha2_128s.verify(
        signature,
        message,
        publicKey
      );

    default:
      throw new Error(
        'Digital signatures require ML-DSA-65 or SLH-DSA-SHA2-128s'
      );
  }
}

/**
 * Establish a shared secret using ML-KEM-768.
 */
export function encapsulateSecret(publicKey) {
  return ml_kem768.encapsulate(publicKey);
}

/**
 * Recover the shared secret using ML-KEM-768.
 */
export function decapsulateSecret(cipherText, secretKey) {
  return ml_kem768.decapsulate(cipherText, secretKey);
}