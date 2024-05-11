import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import emailVerificationRouter from "./emailVerificationRouter";
import { logUserSessionMiddleware } from "../middlewares/logUserSessionMiddleware";

const router = Router();

router.use(logUserSessionMiddleware);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/email-verification", emailVerificationRouter);

export default router;
