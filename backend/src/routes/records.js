import express from 'express';
import multer from 'multer';
import { createClient, uploadBuffer, getBufferFromCID } from '../ipfs.js';
import { encryptBuffer, sha256 } from '../crypto.js';
import { createContract } from '../contract.js';
import { ethers } from 'ethers';

const upload = multer();

export default function(config) {
  const router = express.Router();

  // Initialize IPFS client
  const ipfs = createClient(config.IPFS_API);

  // Initialize smart contract
  const { contract } = createContract(config.RPC_URL, config.PRIVATE_KEY, config.CONTRACT_ADDRESS);

  /** --------------------------
   * Helper: Convert recordId to bytes32 safely
   * ------------------------- */
  const toBytes32 = (str) => {
    // If string ≤ 31 chars, formatBytes32String works
    if (str.length <= 31) {
      return ethers.utils.formatBytes32String(str);
    }
    // Otherwise, hash it
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
  };

  /** --------------------------
   * 1️⃣ Upload Medical Record
   * ------------------------- */
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const { patientAddress, recordId } = req.body;
      const fileBuf = req.file?.buffer;

      // Validation
      if (!fileBuf) return res.status(400).json({ error: "File missing" });
      if (!patientAddress || !ethers.utils.isAddress(patientAddress))
        return res.status(400).json({ error: "Invalid Ethereum address" });
      if (!recordId || recordId.length === 0)
        return res.status(400).json({ error: "Record ID missing" });

      const recordIdBytes32 = toBytes32(recordId);

      // Encrypt file automatically
      const { encrypted, key } = encryptBuffer(fileBuf);

      // Upload encrypted file to IPFS
      const cid = await uploadBuffer(ipfs, encrypted);

      // File hash for integrity
      const fileHash = sha256(encrypted);
      const fileHashBytes32 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fileHash));

      // Store metadata on blockchain
      const tx = await contract.addRecord(recordIdBytes32, patientAddress, cid, fileHashBytes32);
      await tx.wait();

      res.json({
        success: true,
        cid,
        fileHash,
        symKeyHex: key.toString('hex') // demo only
      });

    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /** --------------------------
   * 2️⃣ Grant Consent
   * ------------------------- */
  router.post('/grant', async (req, res) => {
    try {
      const { recordId, clinicianAddress } = req.body;

      if (!recordId || recordId.length === 0)
        return res.status(400).json({ error: "Record ID missing" });
      if (!clinicianAddress || !ethers.utils.isAddress(clinicianAddress))
        return res.status(400).json({ error: "Invalid clinician Ethereum address" });

      const recordIdBytes32 = toBytes32(recordId);

      // Call smart contract to grant consent
      const tx = await contract.grantConsent(recordIdBytes32, clinicianAddress);
      await tx.wait();

      res.json({ success: true, message: "Consent granted" });

    } catch (err) {
      console.error("Grant consent error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  /** --------------------------
   * 3️⃣ Download Encrypted File
   * ------------------------- */
  router.get('/download/:recordId', async (req, res) => {
    try {
      const { recordId } = req.params;

      if (!recordId || recordId.length === 0)
        return res.status(400).json({ error: "Record ID missing" });

      const recordIdBytes32 = toBytes32(recordId);

      // Fetch record metadata from blockchain
      const record = await contract.records(recordIdBytes32); // adjust if needed

      if (!record.cid || record.cid === "")
        return res.status(404).json({ error: "Record not found" });

      // Fetch encrypted file from IPFS
      const encryptedBuffer = await getBufferFromCID(ipfs, record.cid);

      // Return file as blob
      res.setHeader('Content-Disposition', `attachment; filename="${recordId}.enc"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(encryptedBuffer);

    } catch (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
