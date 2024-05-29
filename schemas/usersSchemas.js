import Joi from "joi";

export const registerUserSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    subscription: Joi.string().valid("starter", "pro", "business"),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
});
