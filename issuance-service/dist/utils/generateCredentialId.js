"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCredentialId = generateCredentialId;
const crypto_1 = __importDefault(require("crypto"));
function generateCredentialId(email) {
    const prefix = "KCE";
    const randomPart = crypto_1.default.randomBytes(5).toString("hex").toUpperCase().substring(0, 7);
    return prefix + randomPart;
}
