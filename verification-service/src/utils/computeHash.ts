import crypto from 'crypto';

export const computeHash = (credential: any): string => {
  // Sort keys to ensure consistent hashing
  const sortedCredential = JSON.stringify(credential, Object.keys(credential).sort());
  return crypto.createHash('sha256').update(sortedCredential).digest('hex');
};