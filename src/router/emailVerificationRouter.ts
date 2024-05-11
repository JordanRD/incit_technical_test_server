import { Router } from "express";
import Controllers from "../controllers";
import { loggedInMiddleware } from "../middlewares/authMiddleware";

const emailVerificationRouter = Router();

emailVerificationRouter.post(
    "/send",
    loggedInMiddleware,
    Controllers.emailVerificationController.sendEmailVerification
);
emailVerificationRouter.post(
    "/verify",
    Controllers.emailVerificationController.verifyEmailVerification
);

export default emailVerificationRouter;
