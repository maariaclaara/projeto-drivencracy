import { Router } from "express";
import { newPolls, getPolls, getChoices, getResults } from "../controllers/poll.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { pollSchema } from "../schemas/polls.schema.js";

const pollsRouter = Router();

pollsRouter.post("/poll", validateSchema(pollSchema), newPolls);
pollsRouter.get("/poll", getPolls);
pollsRouter.get("/poll/:id/choice", getChoices);
pollsRouter.get("/poll/:id/result", getResults);

export default pollsRouter;