import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import keysRouter from './routes/keys.js';
import signaturesRouter from './routes/signatures.js';

const app = express();
const PORT = 5000;

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json({
  limit: '1mb'
}));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    application: 'PQC Secure Vault'
  });
});

app.use('/api/keys', keysRouter);
app.use('/api/signatures', signaturesRouter);

app.listen(PORT, () => {
  console.log(
    `PQC Secure Vault running at http://localhost:${PORT}`
  );
});