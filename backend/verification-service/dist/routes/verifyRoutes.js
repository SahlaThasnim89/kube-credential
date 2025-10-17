"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verificationController_1 = require("../controller/verificationController");
const router = (0, express_1.Router)();
router.post('/', verificationController_1.verifyCredential);
exports.default = router;
