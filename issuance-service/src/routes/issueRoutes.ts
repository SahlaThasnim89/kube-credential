import { Router } from "express";
import { issueCredential,checkCredential } from "../controller/issuanceController.ts";

const router=Router() 

router.post('/',issueCredential);
router.post('/check', checkCredential);

export default router;