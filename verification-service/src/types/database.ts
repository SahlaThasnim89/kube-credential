export interface CredentialRow {
    id: number;
    hash: string;
    credential: string;
    issuedAt: string;
    worker: string;
  }
  
  export interface VerificationLog {
    id: number;
    hash: string;
    verifiedAt: string;
    verifiedBy: string;
    status: 'verified' | 'not_found';
    worker: string;
  }