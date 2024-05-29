import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/users.js";
import { registerUserSchema } from "../schemas/usersSchemas.js";

export async function register(req, res, next) {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            subscription: req.body.subscription,
        };

        const { error, value } = registerUserSchema.validate(userData, { abortEarly: false });

        if (typeof error !== "undefined") {
            return res.status(400).json({ message: error.message });
        }

        const user = await User.findOne({ email: value.email });

        if (user !== null) {
            return res.status(409).send({ message: "Email in use" });
        }

        const passwordHash = await bcrypt.hash(value.password, 10);

        const data = await User.create({ email: value.email, password: passwordHash, subscription: value.subscription });

        res.status(201).send({
            user: {
                email: data.email,
                subscription: data.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
        };

        const { error, value } = registerUserSchema.validate(userData, { abortEarly: false });

        if (typeof error !== "undefined") {
            return res.status(400).json({ message: error.message });
        }

        const user = await User.findOne({ email: value.email });

        const isMatch = await bcrypt.compare(value.password, user.password);

        if (user === null || isMatch === false) {
            return res.status(401).send({ message: "Email or password is wrong" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const data = await User.findByIdAndUpdate(user._id, { token }, { new: true });

        res.status(201).send({
            user: {
                email: data.email,
                subscription: data.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

export async function current(req, res, next) {
    try {
        const { id } = req.user;

        const user = await User.findOne({ _id: id });

        res.status(200).send({
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}