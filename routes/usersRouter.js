import express from "express";

import { current, login, logout, register } from "../controllers/usersControllers.js";
import auth from "../middlewares/auth.js";

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.post("/logout", auth, logout);
usersRouter.get("/current", auth, current);

export default usersRouter;
