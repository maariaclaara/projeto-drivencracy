import joi from "joi";

export const pollSchema = joi.object({
  title: joi.string().min(1).required(),
  pollId: joi.string().required(),
});