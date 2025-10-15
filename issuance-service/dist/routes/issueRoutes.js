"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issuanceController_ts_1 = require("../controller/issuanceController.ts");
const router = (0, express_1.Router)();
router.post('/', issuanceController_ts_1.issueCredential);
router.post('/check', issuanceController_ts_1.checkCredential);
exports.default = router;
