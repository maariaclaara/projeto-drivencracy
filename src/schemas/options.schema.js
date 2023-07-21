import joi from "joi";

export const optionsSchema = joi.object({
  title: joi.string().min(1).required(),
  pollId: joi.string().required(),
});