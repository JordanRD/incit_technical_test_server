import { Request, Response } from "express";
import { createResponse, createResponseFromError } from "../utils";
import { BadRequestError } from "../models/AppError";

export default class EmailVerificationController {
    static async sendEmailVerification(req: Request, res: Response) {
        try {
            await req.services.emailVerificationService.sendEmailVerification(
                req.user!.id,
                req.user!.email
            );
            const response = createResponse();
            res.status(response.status).json(response);
        } catch (error) {
            const response = createResponseFromError(error);
            res.status(response.status).json(response);
        }
    }
    static async verifyEmailVerification(
        req: Request<{}, {}, { code: string }>,
        res: Response
    ) {
        try {
            if (!req.body.code)
                throw new BadRequestError("please input verification code!");

            await req.services.emailVerificationService.verifyEmail(
                req.body.code
            );
            const response = createResponse();
            res.status(response.status).json(response);
        } catch (error) {
            const response = createResponseFromError(error);
            res.status(response.status).json(response);
        }
    }
}
