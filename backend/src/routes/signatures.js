import { Router } from 'express';

import {
  signDocument,
  verifyDocument
} from '../services/pqc.js';

import { getKeyPair } from '../services/keyStore.js';

const router = Router();

const signatureAlgorithms = [
  'ML-DSA-65',
  'SLH-DSA-SHA2-128s'
];

// Sign a document
router.post('/sign', (req, res) => {
  try {
    const { keyId, document } = req.body;

    if (
      typeof keyId !== 'string' ||
      typeof document !== 'string' ||
      Buffer.byteLength(document, 'utf8') > 100_000
    ) {
      return res.status(400).json({
        error: 'Provide a valid key ID and document under 100 KB'
      });
    }

    const keys = getKeyPair(keyId);

    if (!signatureAlgorithms.includes(keys.algorithm)) {
      return res.status(400).json({
        error: 'This key cannot sign documents'
      });
    }

    const signature = signDocument(
      keys.algorithm,
      document,
      keys.secretKey
    );

    res.json({
      algorithm: keys.algorithm,
      signature: Buffer.from(signature).toString('base64')
    });
  } catch (error) {
    console.error('Signing failed:', error.message);

    res.status(400).json({
      error: 'Unable to sign document'
    });
  }
});

// Verify a document's signature
router.post('/verify', (req, res) => {
  try {
    const {
      keyId,
      document,
      signature
    } = req.body;

    if (
      typeof keyId !== 'string' ||
      typeof document !== 'string' ||
      typeof signature !== 'string' ||
      Buffer.byteLength(document, 'utf8') > 100_000 ||
      signature.length > 100_000
    ) {
      return res.status(400).json({
        error: 'Invalid verification request'
      });
    }

    const keys = getKeyPair(keyId);

    if (!signatureAlgorithms.includes(keys.algorithm)) {
      return res.status(400).json({
        error: 'This key cannot verify signatures'
      });
    }

    const signatureBytes = Buffer.from(signature, 'base64');

    // Reject malformed or noncanonical Base64 input.
    if (signatureBytes.toString('base64') !== signature) {
      return res.status(400).json({
        error: 'Invalid signature encoding'
      });
    }

    const valid = verifyDocument(
      keys.algorithm,
      document,
      signatureBytes,
      keys.publicKey
    );

    res.json({
      algorithm: keys.algorithm,
      valid
    });
  } catch (error) {
    console.error('Verification failed:', error.message);

    res.status(400).json({
      error: 'Unable to verify signature'
    });
  }
});

export default router;  