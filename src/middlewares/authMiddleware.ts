import { NextFunction, Request, Response } from "express";
import { createResponseFromError } from "../utils";
import { UnauthorizedError } from "../models/AppError";

export const loggedInMiddleware = (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    if (req.user) {
        return next();
    }
    const response = createResponseFromError(
        new UnauthorizedError("user not logged in!")
    );
    resp.status(response.status).send(response);
    // return;
};

export const verifiedMiddleware = (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    if (req.user?.verified) {
        return next();
    }
    const response = createResponseFromError(
        new UnauthorizedError("user not verified!")
    );
    resp.status(response.status).send(response);
};
