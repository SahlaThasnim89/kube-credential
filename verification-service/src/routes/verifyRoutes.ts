import { Router } from "express";
import { verifyCredential } from "../controller/verificationController";

const router=Router() 

router.post('/',verifyCredential)

export default router;