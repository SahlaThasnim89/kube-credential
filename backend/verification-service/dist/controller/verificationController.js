"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCredential = void 0;
const createWorker_1 = require("../utils/createWorker");
const axios_1 = __importDefault(require("axios"));
const computeHash_1 = require("../utils/computeHash");
const verifyCredential = async (req, res) => {
    try {
        const credential = req.body;
        if (!credential || !credential.id) {
            return res.status(400).json({ message: "Credential JSON is required" });
        }
        const hash = (0, computeHash_1.computeHash)({
            id: credential.id,
            name: credential.name,
            email: credential.email,
        });
        const issuanceUrl = process.env.ISSUANCE_URL;
        const response = await axios_1.default.post(issuanceUrl, { hash });
        if (!response.data.exists) {
            return res.status(404).json({
                status: "not_found",
                message: "Credential not found or has not been issued",
            });
        }
        const worker = (0, createWorker_1.createWorker)();
        return res.status(200).json({
            status: "verified",
            message: "Credential is valid",
            credential,
            verifiedAt: new Date().toISOString(),
            worker,
        });
    }
    catch (error) {
        console.error("Error verifying credential:", error);
        return res.status(500).json({ message: "Failed to verify credential" });
    }
};
exports.verifyCredential = verifyCredential;
