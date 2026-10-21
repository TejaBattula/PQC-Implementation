## 🔐 NIST Post-Quantum Cryptography (PQC) Standards

### Overview

Post-Quantum Cryptography (PQC) refers to cryptographic algorithms designed to protect information against attacks from both classical and quantum computers.

The National Institute of Standards and Technology (NIST) has standardized post-quantum cryptographic algorithms to support the transition toward quantum-resistant security.

On August 13, 2024, NIST finalized three principal PQC standards: FIPS 203, FIPS 204, and FIPS 205.

### NIST-Standardized PQC Algorithms

| Standard | Algorithm | Cryptographic Function | Application |
|---|---|---|---|
| FIPS 203 | ML-KEM | Key encapsulation and shared-secret establishment | Secure key establishment for data encryption |
| FIPS 204 | ML-DSA | Digital signatures | Document signing and integrity verification |
| FIPS 205 | SLH-DSA | Stateless hash-based digital signatures | Alternative digital signature mechanism |

### 1. ML-KEM — FIPS 203

**Full Name:** Module-Lattice-Based Key-Encapsulation Mechanism

ML-KEM enables two parties to establish a shared secret over a public channel. The shared secret can then be used with a symmetric encryption algorithm, such as AES-256-GCM, to encrypt and decrypt confidential information.

**Workflow:**

1. Generate an ML-KEM key pair.
2. Make the public key available to the sender.
3. Encapsulate a shared secret using the recipient's public key.
4. Send the resulting encapsulation ciphertext to the recipient.
5. Decapsulate it using the recipient's private key to recover the same shared secret.
6. Derive an encryption key and use AES-256-GCM to encrypt or decrypt the application data.

**Important:** ML-KEM does not directly encrypt arbitrary messages. It establishes a shared secret that can be used for symmetric encryption.

**Example application:** Protecting contact-form submissions before storing them in a database.

Official standard: [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final)

### 2. ML-DSA — FIPS 204

**Full Name:** Module-Lattice-Based Digital Signature Algorithm

ML-DSA creates digital signatures that allow a recipient to verify the authenticity and integrity of a signed message or document.

**Workflow:**

1. Generate an ML-DSA public and private key pair.
2. Use the private key to sign a document.
3. Send the document and its signature to the recipient.
4. Verify the signature using the public key.
5. Reject the document if signature verification fails.

**Example application:** Signing confidential documents, software artifacts, and important business records.

Official standard: [NIST FIPS 204](https://csrc.nist.gov/pubs/fips/204/final)

### 3. SLH-DSA — FIPS 205

**Full Name:** Stateless Hash-Based Digital Signature Algorithm

SLH-DSA is a post-quantum digital signature algorithm based on cryptographic hash functions. It provides an alternative to lattice-based digital signatures.

**Workflow:**

1. Generate an SLH-DSA public and private key pair.
2. Sign a message using the private key.
3. Send the message and signature to the recipient.
4. Verify the signature using the public key.
5. Confirm whether the message's signature is valid.

**Example application:** Providing an alternative hash-based mechanism for verifying important documents and signed artifacts.

Official standard: [NIST FIPS 205](https://csrc.nist.gov/pubs/fips/205/final)

---

## ⚙️ PQC Implementation in Q-Prakriti

Q-Prakriti explores the implementation of NIST-standardized post-quantum cryptographic algorithms in a Node.js backend.

### Technology Stack

- **Node.js:** Backend runtime
- **Express.js:** REST API framework
- **@noble/post-quantum:** JavaScript post-quantum cryptography library
- **ML-KEM-768:** Shared-secret establishment
- **ML-DSA:** Digital signatures
- **SLH-DSA:** Stateless hash-based digital signatures
- **AES-256-GCM:** Authenticated symmetric encryption
- **MongoDB:** Database for application records

### Installation

Navigate to the backend directory:

```bash
cd contact-backend
```

Install the dependencies:

```bash
npm install express mongoose cors helmet express-rate-limit dotenv @noble/post-quantum
```

### Generate Cryptographic Keys

If your backend defines a key-generation script in `package.json`, run:

```bash
npm run keygen
```

For a project configured with a script named `keygen`, this executes the corresponding key-generation file.

**Security note:** Keep private keys outside the public repository. Do not commit private keys, `.env` secrets, or production encryption keys to GitHub.

### Start the Backend

```bash
npm start
```

For a development script configured with `nodemon`, you can use:

```bash
npm run dev
```

### Test the ML-KEM API

If the backend exposes an ML-KEM encapsulation endpoint, test it using:

```bash
curl -X POST http://localhost:5000/api/kem/encapsulate \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "YOUR_ML_KEM_KEY_ID"
  }'
```

The actual request fields and endpoint must match your backend implementation.

An ML-KEM response typically contains an encapsulation ciphertext and a representation of the shared secret or derived result. In a secure production API, avoid returning the raw shared secret to clients.

### Test the ML-DSA API

If your backend exposes a document-signing endpoint, use:

```bash
curl -X POST http://localhost:5000/api/signatures/sign \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "YOUR_ML_DSA_KEY_ID",
    "document": "This is my confidential Q-Prakriti document."
  }'
```

The signing endpoint should return a signature or a signature identifier, depending on your implementation.

### Test the SLH-DSA API

If your backend implements an SLH-DSA signing endpoint, use:

```bash
curl -X POST http://localhost:5000/api/signatures/slh-dsa/sign \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "YOUR_SLH_DSA_KEY_ID",
    "document": "Verify the integrity of this Q-Prakriti document."
  }'
```

This endpoint is an example. Implement it in your backend before using the command.

### Test Document Signature Verification

If your application supports ML-DSA verification:

```bash
curl -X POST http://localhost:5000/api/signatures/verify \
  -H "Content-Type: application/json" \
  -d '{
    "keyId": "YOUR_ML_DSA_KEY_ID",
    "document": "This is my confidential Q-Prakriti document.",
    "signature": "YOUR_SIGNATURE"
  }'
```

Replace the placeholders with the actual key ID and signature returned by your implementation.

---

## 🧪 Testing and Validation

After implementing the algorithms, test the following operations:

| Algorithm | Test | Expected Result |
|---|---|---|
| ML-KEM | Encapsulation and decapsulation | Both parties derive the same shared secret |
| ML-KEM | Invalid or mismatched key handling | The application must not accept an incorrect derived key |
| ML-DSA | Sign and verify an unchanged document | Verification succeeds |
| ML-DSA | Verify a modified document | Verification fails |
| SLH-DSA | Sign and verify an unchanged document | Verification succeeds |
| SLH-DSA | Verify a modified document | Verification fails |

These are functional test expectations, not claims that the implementation has already passed them.

### Run Backend Tests

If your `package.json` defines a test script:

```bash
npm test
```

To inspect the available scripts:

```bash
npm run
```

### Verify Dependencies

```bash
npm list @noble/post-quantum
```

To inspect the installed package version:

```bash
npm ls @noble/post-quantum
```

---

## 🔒 Security Considerations

- Use ML-KEM for shared-secret establishment, not as a direct replacement for symmetric encryption.
- Use authenticated encryption, such as AES-256-GCM, to protect application data.
- Keep private keys in a secure key-management system or other appropriately protected storage.
- Never expose private keys or raw shared secrets through API responses or logs.
- Authenticate and authorize access to sensitive cryptographic operations.
- Validate signatures before trusting signed documents.
- Use secure transport, such as properly configured HTTPS/TLS, for API communication.
- Test interoperability and security behavior before deploying cryptographic features to production.
- Use cryptographic implementations and configurations appropriate for the applicable security requirements.

**Note:** Using a NIST-standardized algorithm does not automatically make an entire application NIST-certified or FIPS-validated. Such validation depends on the applicable cryptographic module and validation requirements.

---

## 📚 Official References

- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [FIPS 203 — ML-KEM](https://csrc.nist.gov/pubs/fips/203/final)
- [FIPS 204 — ML-DSA](https://csrc.nist.gov/pubs/fips/204/final)
- [FIPS 205 — SLH-DSA](https://csrc.nist.gov/pubs/fips/205/final)
- [Noble Post-Quantum Cryptography Library](https://github.com/paulmillr/noble-post-quantum)