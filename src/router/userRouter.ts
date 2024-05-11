import { Router } from "express";
import Controllers from "../controllers";
import {
    loggedInMiddleware,
    verifiedMiddleware,
} from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.use(loggedInMiddleware);

userRouter.get("/current", Controllers.userController.currentUser);

userRouter.get(
    "/dashboard",
    verifiedMiddleware,
    Controllers.userController.getUserDashboard
);
userRouter.post(
    "/update",
    Controllers.userController.update
);
userRouter.post(
    "/change-password",
    Controllers.userController.changePassword
);

export default userRouter;
