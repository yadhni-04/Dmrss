import 'dotenv/config';
import express from 'express';
import cors from 'cors'; // ✅ Add CORS
import recordsRouterFactory from './routes/records.js';

const app = express();

// Enable CORS for frontend (localhost:3001)
app.use(cors({
  origin: 'http://localhost:3001', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const config = {
  RPC_URL: process.env.RPC_URL || 'http://127.0.0.1:8545',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  IPFS_API: process.env.IPFS_API || 'http://127.0.0.1:5001'
};

app.use('/api/records', recordsRouterFactory(config));

app.get('/', (req, res) => res.send('DMRS backend running'));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
