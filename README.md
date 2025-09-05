Decentralized Medical Record System (DMRS)
A secure, decentralized system for uploading, storing, and sharing encrypted medical records using Ethereum and IPFS. Patients can upload medical records, which are automatically encrypted and stored on IPFS, and control access through blockchain-based consent.
Table of Contents
Overview
Features
Tech Stack
Prerequisites
Project Setup
Running the Project
Implemented Functionality
API Endpoints
Frontend Usage
Future Improvements
Overview
This project enables patients to securely upload their medical records. Files are encrypted automatically, uploaded to IPFS, and relevant metadata (record ID, patient address, CID, hash) is stored on Ethereum blockchain. Only authorized users with granted consent can access the records.
Features
Upload medical records securely
Automatic AES encryption for all files
IPFS storage with immutable CIDs
Metadata stored on Ethereum blockchain
Grant/revoke access to clinicians
Download encrypted records
Integrity verification via SHA-256 hash
Tech Stack
Frontend: React.js
Backend: Node.js + Express.js
Blockchain: Ethereum (Ganache / local testnet / testnet/mainnet)
IPFS: IPFS HTTP Client
Encryption: AES symmetric encryption
Ethereum Library: ethers.js
Prerequisites
Before running the project, make sure you have:
Node.js & npm
Download and install: https://nodejs.org
Check versions:
node -v
npm -v
Docker (Optional for IPFS)
Download and install: https://www.docker.com/get-started
To run IPFS locally in a container:
docker run -d --name ipfs_host -v ipfs_staging:/export -v ipfs_data:/data/ipfs -p 5001:5001 -p 8080:8080 ipfs/go-ipfs:latest
Ganache (Optional for local Ethereum)
GUI: https://trufflesuite.com/ganache
CLI: npm install -g ganache
Metamask Wallet (Optional)
For Ethereum account management and testing
Project Setup
Clone the repository
git clone https://github.com/yourusername/dmrs-mvp.git
cd dmrs-mvp
Install backend dependencies
cd backend
npm install
Install frontend dependencies
cd ../frontend
npm install
Configure environment variables
Create a .env file in the backend folder:
RPC_URL=http://127.0.0.1:8545      # Ethereum RPC endpoint (Ganache or testnet)
PRIVATE_KEY=<your_wallet_private_key>
CONTRACT_ADDRESS=<deployed_contract_address>
IPFS_API=http://127.0.0.1:5001    # IPFS API endpoint
PORT=4000
Running the Project
Start backend
cd backend
npm start
Backend runs at: http://localhost:4000
Start frontend
cd frontend
npm start
Frontend runs at: http://localhost:3000
Implemented Functionality
So far, the project implements:
File Upload
Users can upload a file and provide a record ID and patient Ethereum address.
Backend automatically encrypts the file and uploads it to IPFS.
Metadata stored on Ethereum blockchain:
recordId (converted to bytes32)
patientAddress
IPFS CID
SHA-256 hash
Grant Consent
Patients can grant access to a clinician for a specific record.
Consent recorded on Ethereum.
Download Encrypted Records
Authorized users can download the encrypted file from IPFS.
Error Handling
Validates Ethereum addresses
Ensures record ID length constraints (bytes32)
Handles missing files
Frontend
React-based upload page
Displays CID and encryption key (for demo purposes)
API Endpoints
1. Upload Medical Record
POST /api/records/upload
Body:
{
  "patientAddress": "0x1234...",
  "recordId": "uniqueRecord123",
  "file": <file>
}
Response:
{
  "success": true,
  "cid": "<IPFS_CID>",
  "fileHash": "<SHA256_HASH>",
  "symKeyHex": "<encryption_key>"
}
2. Grant Consent
POST /api/records/grant
Body:
{
  "recordId": "uniqueRecord123",
  "clinicianAddress": "0xABCD..."
}
Response:
{
  "success": true,
  "message": "Consent granted"
}
3. Download Record
GET /api/records/download/:recordId
Response: Encrypted file as attachment
Frontend Usage
Go to the Upload Page
Enter:
Patient Ethereum address (0x…)
Record ID (max 32 chars recommended)
File to upload
Click Upload
On success, the system returns:
CID (IPFS reference)
File hash (SHA-256)
Encryption key (hex) – for demo