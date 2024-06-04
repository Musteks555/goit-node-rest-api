import express from "express";

import { current, login, logout, register, changeAvatar } from "../controllers/usersControllers.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", auth, logout);
usersRouter.get("/current", auth, current);
usersRouter.patch("/avatars", auth, upload.single("avatar"), changeAvatar);

export default usersRouter;
