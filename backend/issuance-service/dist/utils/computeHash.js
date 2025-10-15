"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHash = computeHash;
const sortObject_1 = require("./sortObject");
function computeHash(obj) {
    const stable = JSON.stringify((0, sortObject_1.sortObject)(obj));
    return require('crypto').createHash('sha256').update(stable).digest('hex');
}
