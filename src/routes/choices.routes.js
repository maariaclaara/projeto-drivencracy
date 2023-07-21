import { Router } from "express";
import { newChoices, newVotes } from "../controllers/choices.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { optionsSchema } from "../schemas/options.schema.js";

const choicesRouter = Router();

choicesRouter.post("/choice", validateSchema(optionsSchema), newChoices);
choicesRouter.post("/choice/:id/vote", newVotes);

export default choicesRouter;