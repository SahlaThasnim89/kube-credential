import { sortObject } from "./sortObject";

function computeHash(obj: any) {
    const stable = JSON.stringify(sortObject(obj));
    return require('crypto').createHash('sha256').update(stable).digest('hex');
  }

export {computeHash}