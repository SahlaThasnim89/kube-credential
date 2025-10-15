export interface IssueForm {
    name: string;
    email: string;
  }
  
export interface IssueResponse {
    existing: any;
    worker: string;
    status: string;
    message: string;
    credential?: { id: string; name: string; email: string; issuedAt: string };
  }