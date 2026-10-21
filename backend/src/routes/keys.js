import { Router } from 'express';
import { generateKeys } from '../services/pqc.js';
import { saveKeyPair } from '../services/keyStore.js';

const router = Router();

const allowedAlgorithms = [
  'ML-KEM-768',
  'ML-DSA-65',
  'SLH-DSA-SHA2-128s'
];

router.post('/generate', (req, res) => {
  try {
    const { algorithm } = req.body;

    if (!allowedAlgorithms.includes(algorithm)) {
      return res.status(400).json({
        error: 'Unsupported algorithm'
      });
    }

    const keys = generateKeys(algorithm);
    const result = saveKeyPair(algorithm, keys);

    res.status(201).json({
      message: 'Key pair generated successfully',
      ...result
    });
  } catch (error) {
    console.error('Key generation failed:', error.message);

    res.status(500).json({
      error: 'Key generation failed'
    });
  }
});

export default router;