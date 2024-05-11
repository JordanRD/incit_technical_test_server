import { Router } from "express";
import passport from "passport";
import Controllers from "../controllers";
import { LOGIN_REDIRECT_PATH } from "../constants";
import AppError from "../models/AppError";
import { loggedInMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", Controllers.userController.register);

authRouter.post("/login", Controllers.userController.login);

authRouter.post(
    "/logout",
    loggedInMiddleware,
    Controllers.userController.logout
);


authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

authRouter.get(
    "/facebook",
    passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
    })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: LOGIN_REDIRECT_PATH,
    })
);

authRouter.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: LOGIN_REDIRECT_PATH,
    })
);

export default authRouter;
