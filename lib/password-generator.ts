export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeUppercase) {
    charset += UPPERCASE;
  }
  if (options.includeLowercase) {
    charset += LOWERCASE;
  }
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }
  
  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  let password = '';
  
  // Use crypto.getRandomValues (works in both browser and Node.js 15.0.0+)
  const array = new Uint32Array(options.length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for older Node.js versions
    const nodeCrypto = require('crypto');
    const buffer = nodeCrypto.randomBytes(options.length * 4);
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);
    for (let i = 0; i < options.length; i++) {
      array[i] = view.getUint32(i * 4, true);
    }
  }
  
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  // Ensure at least one character from each selected type
  if (options.includeUppercase && !/[A-Z]/.test(password)) {
    const randomIndex = Math.floor(Math.random() * password.length);
    password = password.slice(0, randomIndex) + UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)] + password.slice(randomIndex + 1);
  }
  if (options.includeLowercase && !/[a-z]/.test(password)) {
    const randomIndex = Math.floor(Math.random() * password.length);
    password = password.slice(0, randomIndex) + LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)] + password.slice(randomIndex + 1);
  }
  if (options.includeNumbers && !/[0-9]/.test(password)) {
    const randomIndex = Math.floor(Math.random() * password.length);
    password = password.slice(0, randomIndex) + NUMBERS[Math.floor(Math.random() * NUMBERS.length)] + password.slice(randomIndex + 1);
  }
  if (options.includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    const randomIndex = Math.floor(Math.random() * password.length);
    password = password.slice(0, randomIndex) + SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] + password.slice(randomIndex + 1);
  }
  
  return password;
}

export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');
  
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Add symbols');
  
  if (password.length >= 20) score += 1;
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthLabel = strengthLabels[Math.min(score, strengthLabels.length - 1)];
  
  return {
    score: Math.min(score, 6),
    feedback: feedback.length > 0 ? feedback.join(', ') : strengthLabel
  };
}

