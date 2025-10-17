"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createWorker = () => {
    // In Kubernetes, HOSTNAME is automatically set to pod name
    if (process.env.HOSTNAME) {
        return process.env.HOSTNAME;
    }
    // Fallback for local development
    return `verification-worker-${crypto_1.default.randomBytes(4).toString('hex')}`;
};
exports.createWorker = createWorker;
