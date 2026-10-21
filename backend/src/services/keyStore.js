import { randomUUID } from 'node:crypto';

const keyPairs = new Map();

export function saveKeyPair(algorithm, keys) {
  const id = randomUUID();

  keyPairs.set(id, {
    algorithm,
    publicKey: keys.publicKey,
    secretKey: keys.secretKey
  });

  return {
    id,
    algorithm,
    publicKey: Buffer.from(keys.publicKey).toString('base64')
  };
}

export function getKeyPair(id, algorithm) {
  const keys = keyPairs.get(id);

  if (!keys) {
    throw new Error('Key not found');
  }

  if (algorithm && keys.algorithm !== algorithm) {
    throw new Error('Key algorithm mismatch');
  }

  return keys;
}