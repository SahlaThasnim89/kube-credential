import crypto from "crypto";

export function generateCredentialId(email:string): string {
  const prefix = "KCE";
  const randomPart = crypto.randomBytes(5).toString("hex").toUpperCase().substring(0, 7);
  return prefix + randomPart;
}
