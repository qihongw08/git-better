import express from 'express';
import { getStatus, doSomething } from './handlers';

const router = express.Router();

router.get("/status", getStatus);
router.post("/action", doSomething);

export default router;
