import crypto from 'crypto';

export function encryptBuffer(buffer) {
  const key = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(12);  // 96-bit for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { encrypted: Buffer.concat([iv, tag, enc]), key };
}

export function decryptBuffer(blob, key) {
  const iv = blob.slice(0, 12);
  const tag = blob.slice(12, 28);
  const ciphertext = blob.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
