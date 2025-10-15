import crypto from 'crypto';

export const createWorker = (): string => {
  // In Kubernetes, HOSTNAME is automatically set to pod name
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME;
  }
  
  // Fallback for local development
  return `verification-worker-${crypto.randomBytes(4).toString('hex')}`;
};