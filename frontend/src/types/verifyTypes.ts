export interface VerifyRequest {
  id: string;
}

export interface VerifyResponse {
  issuedAt: string | undefined;
  worker: string;
  status: string;
  message?: string;
  error?: string;
  verifiedAt: string;
}


export interface VerifiedData {
  verifiedBy: string|undefined;
  verifiedAt: string;
}

export interface IssuedData {
  worker: string;
  issuedAt: string;
}