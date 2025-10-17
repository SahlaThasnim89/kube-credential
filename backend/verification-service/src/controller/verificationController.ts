import { Request, Response } from "express";
import { createWorker } from "../utils/createWorker";
import axios from 'axios';
import { computeHash } from "../utils/computeHash";



export const verifyCredential = async (req: Request, res: Response) => {
  try {
    const credential = req.body;

    if (!credential || !credential.id) {
      return res.status(400).json({ message: "Credential JSON is required" });
    }

    const hash = computeHash({
      id: credential.id,
      name: credential.name,
      email: credential.email,
    });

    const issuanceUrl = process.env.ISSUANCE_URL as string

    const response = await axios.post(issuanceUrl, { hash });

    if (!response.data.exists) {
      return res.status(404).json({
        status: "not_found",
        message: "Credential not found or has not been issued",
        error: "Credential not found",
      });
    }

    const worker = createWorker();
    return res.status(200).json({
      status: "verified",
      message: "Credential is valid",
      credential,
      verifiedAt: new Date().toISOString(),
      worker,
    });

  } catch (error) {
    console.error("Error verifying credential:", error);
    return res.status(500).json({ message: "Failed to verify credential" });
  }
};
