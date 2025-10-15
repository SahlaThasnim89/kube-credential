"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortObject = sortObject;
function sortObject(o) {
    if (Array.isArray(o))
        return o.map(sortObject);
    if (o && typeof o === 'object') {
        return Object.keys(o).sort().reduce((acc, k) => (acc[k] = sortObject(o[k]), acc), {});
    }
    return o;
}
