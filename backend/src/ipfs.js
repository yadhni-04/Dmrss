import { create } from 'ipfs-http-client';

/** --------------------------
 * Initialize IPFS client
 * ------------------------- */
export function createClient(apiUrl) {
  return create({ url: apiUrl });
}

/** --------------------------
 * Upload a buffer to IPFS
 * ------------------------- */
export async function uploadBuffer(ipfs, buffer) {
  const result = await ipfs.add(buffer);
  return result.path; // returns CID
}

/** --------------------------
 * Download a buffer from IPFS by CID
 * ------------------------- */
export async function getBufferFromCID(ipfs, cid) {
  const chunks = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
