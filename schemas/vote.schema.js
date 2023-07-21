import joi from "joi";

export const pollSchema = joi.object({
  createdAt: joi.string().required(),
  choiceId: joi.string().required(),
});