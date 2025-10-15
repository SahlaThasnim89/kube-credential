"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredential = exports.issueCredential = void 0;
const db_1 = require("../db");
const computeHash_1 = require("../utils/computeHash");
const createWorker_1 = require("../utils/createWorker");
const generateCredentialId_1 = require("../utils/generateCredentialId");
const issueCredential = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "name and email are required" });
        }
        const id = (0, generateCredentialId_1.generateCredentialId)(email);
        const credentialDataForHash = { id, name, email };
        const hash = (0, computeHash_1.computeHash)(credentialDataForHash);
        const existing = db_1.db
            .prepare("SELECT * FROM credentials WHERE json_extract(credential, '$.email') = ?")
            .get(email);
        if (existing) {
            const existingCredential = JSON.parse(existing.credential);
            if (existingCredential.name === name) {
                return res.status(200).json({
                    status: "exists",
                    message: "Credential already exists for this name and email",
                    id: existingCredential.id,
                    credential: existingCredential,
                    existing: { issuedAt: existing.issuedAt, worker: existing.worker },
                });
            }
            return res.status(400).json({
                status: "email_conflict",
                message: "A credential with this email already exists under a different name",
                credential: existingCredential,
                worker: existing.worker,
                existing: {
                    id: existingCredential.id,
                    name: existingCredential.name,
                    email: existingCredential.email,
                    issuedAt: existing.issuedAt,
                },
            });
        }
        const issuedAt = new Date().toISOString();
        const worker = (0, createWorker_1.createWorker)();
        const credential = { ...credentialDataForHash, issuedAt };
        db_1.db.prepare("INSERT INTO credentials (hash, credential, issuedAt, worker) VALUES (?, ?, ?, ?)").run(hash, JSON.stringify(credential), issuedAt, worker);
        return res.status(201).json({
            status: "issued",
            message: "Credential issued successfully",
            credential,
            worker,
        });
    }
    catch (error) {
        console.error("Error issuing credential:", error);
        return res.status(500).json({
            error: "failed to issue credential",
            message: error instanceof Error ? error.message : "unknown error",
        });
    }
};
exports.issueCredential = issueCredential;
const checkCredential = async (req, res) => {
    try {
        const { hash } = req.body;
        if (!hash) {
            return res.status(400).json({ error: "Hash is required" });
        }
        const existing = db_1.db
            .prepare("SELECT * FROM credentials WHERE hash = ?")
            .get(hash);
        return res.status(200).json({ exists: !!existing });
    }
    catch (error) {
        console.error("Error checking credential:", error);
        return res.status(500).json({
            error: "failed to check credential",
            message: error instanceof Error ? error.message : "unknown error",
        });
    }
};
exports.checkCredential = checkCredential;
