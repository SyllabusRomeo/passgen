import bcrypt from 'bcryptjs';

// Simple encryption key - in production, use a proper key management system
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

// For storing passwords, we'll use a simple encoding (in production, use proper encryption)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Simple encryption for storing passwords (not secure for production - use proper encryption)
export function encryptPassword(password: string): string {
  // In production, use proper encryption like AES-256
  // For now, we'll use a simple base64 encoding with a key
  const encoded = Buffer.from(password).toString('base64');
  return encoded;
}

export function decryptPassword(encrypted: string): string {
  // In production, use proper decryption
  try {
    return Buffer.from(encrypted, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

