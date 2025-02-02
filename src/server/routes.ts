import express from 'express';
import { getStatus, doSomething, getOwnerRepo, createPullRequest } from './handlers';

const router = express.Router();

router.get("/status", getStatus);
router.post("/create-repo", doSomething);
router.get('/repo-info', getOwnerRepo);
router.post('/create-pull-request', createPullRequest);

export default router;
