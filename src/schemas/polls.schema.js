import joi from "joi";

export const pollSchema = joi.object({
  title: joi.string().min(1).required(),
  expireAt: joi.string().min(0),
});