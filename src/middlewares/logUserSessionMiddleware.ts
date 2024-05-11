import { NextFunction, Request, Response } from "express";

export const logUserSessionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user) {
        req.services.logUserSessionDailyService.createLog(req.user.id);
    }
    next();
};
