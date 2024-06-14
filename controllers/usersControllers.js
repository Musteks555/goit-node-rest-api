import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";
import * as fs from "node:fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import mail from "../mail.js";

import User from "../models/users.js";
import { loginUserSchema, registerUserSchema, verifyEmailSchema } from "../schemas/usersSchemas.js";

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
        const verificationToken = nanoid();
        const avatarURL = gravatar.url(value.email);

        mail.sendMail({
            to: value.email,
            from: "artemmustek73@gmail.com",
            subject: "Welcome!",
            html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you email please open the link http://localhost:3000/users/verify/${verificationToken}`,
        });

        const data = await User.create({
            email: value.email,
            password: passwordHash,
            subscription: value.subscription,
            avatarURL,
            verificationToken,
        });

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

        const { error, value } = loginUserSchema.validate(userData, { abortEarly: false });

        if (typeof error !== "undefined") {
            return res.status(400).json({ message: error.message });
        }

        const user = await User.findOne({ email: value.email });

        const isMatch = await bcrypt.compare(value.password, user.password);

        if (user === null || isMatch === false) {
            return res.status(401).send({ message: "Email or password is wrong" });
        }

        if (user.verify === false) {
            return res.status(401).send({ message: "Please verify your email" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const data = await User.findByIdAndUpdate(user._id, { token }, { new: true });

        res.status(201).send({
            token,
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
            email: user.email,
            subscription: user.subscription,
        });
    } catch (error) {
        next(error);
    }
}

export async function changeAvatar(req, res, next) {
    try {
        const newPath = path.resolve("public", "avatars", req.file.filename);

        await fs.rename(req.file.path, newPath);

        const image = await Jimp.read(newPath);
        await image.resize(250, 250).quality(60).writeAsync(newPath);

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: `/avatars/${req.file.filename}` }, { new: true });

        res.send({ avatarURL: user.avatarURL });
    } catch (error) {
        next(error);
    }
}

export async function verifyEmail(req, res, next) {
    try {
        const { verificationToken } = req.params;

        const user = await User.findOne({ verificationToken });

        if (user === null) {
            return res.status(404).send({ message: "User not found" });
        }

        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: null,
        });

        res.send({ message: "Verification successful" });
    } catch (error) {
        next(error);
    }
}

export async function repeatVerifyEmail(req, res, next) {
    try {
        const userData = {
            email: req.body.email,
        };

        const { error, value } = verifyEmailSchema.validate(userData, { abortEarly: false });

        if (typeof error !== "undefined") {
            return res.status(400).json({ message: error.message });
        }

        const user = await User.findOne({ email: value.email });

        if (user === null) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.verify === true) {
            return res.status(400).send({ message: "Verification has already been passed" });
        }

        mail.sendMail({
            to: value.email,
            from: "artemmustek73@gmail.com",
            subject: "Welcome!",
            html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${user.verificationToken}">link</a>`,
            text: `To confirm you email please open the link http://localhost:3000/users/verify/${user.verificationToken}`,
        });

        res.send({ message: "Verification email sent" });
    } catch (error) {
        next(error);
    }
}
