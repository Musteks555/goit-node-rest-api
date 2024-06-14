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

export const verifyEmailSchema = Joi.object({
    email: Joi.string().required().email().messages({
        "any.required": "Missing required field email",
    }),
});
