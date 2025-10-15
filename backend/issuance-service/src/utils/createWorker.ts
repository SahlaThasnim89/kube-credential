export const createWorker = (): string => {
    return process.env.HOSTNAME || `worker-${require('crypto').randomBytes(4).toString('hex')}`;
  };