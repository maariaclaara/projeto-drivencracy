import { Router } from "express";
import pollsRouter from "./poll.routes.js";
import choicesRouter from "./choices.routes.js";

const router = Router();

router.use(pollsRouter);
router.use(choicesRouter);

export default router;