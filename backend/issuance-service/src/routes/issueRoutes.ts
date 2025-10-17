import { Router } from "express";
import { issueCredential,checkCredential } from "../controller/issuanceController";

const router=Router() 

router.post('/',issueCredential);
router.post('/check', checkCredential);

export default router;