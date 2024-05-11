import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    phone: Joi.string().required().min(9),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email(),
    phone: Joi.string().min(9),
});
