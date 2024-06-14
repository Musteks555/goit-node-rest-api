import express from "express";

import { current, login, logout, register, changeAvatar, verifyEmail, repeatVerifyEmail } from "../controllers/usersControllers.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", auth, logout);
usersRouter.get("/current", auth, current);
usersRouter.patch("/avatars", auth, upload.single("avatar"), changeAvatar);
usersRouter.get("/verify/:verificationToken", verifyEmail);
usersRouter.post("/verify", repeatVerifyEmail);

export default usersRouter;
