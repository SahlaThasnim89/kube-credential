"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = void 0;
const createWorker = () => {
    return process.env.HOSTNAME || `worker-${require('crypto').randomBytes(4).toString('hex')}`;
};
exports.createWorker = createWorker;
