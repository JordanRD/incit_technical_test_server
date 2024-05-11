import SMTPTransport from "nodemailer/lib/smtp-transport";
import { HTTP_STATUS_CODES, SALT } from "./constants";
import AppError, { InternalServerError } from "./models/AppError";
import emailService from "./nodemailer";
import { Response } from "./types/General";
import bcrypt, { genSaltSync } from "bcrypt";

export const createResponse = (
    status = HTTP_STATUS_CODES.OK,
    message = "Success",
    data?: unknown,
    scope?: string
): Response => {
    return {
        message,
        status,
        scope,
        data,
    };
};

export const getAppError = (error: unknown) => {
    let appError: AppError;
    if (error instanceof AppError) {
        appError = error;
    } else {
        appError = new InternalServerError();
    }
    return appError;
};

export const createResponseFromError = (error: unknown): Response => {
    const appError = getAppError(error);
    return createResponse(
        appError.status,
        appError.message,
        null,
        appError.scope
    );
};

export const hashPassword = (password: string) => {
    // const salt = genSaltSync(10);
    // console.log("🚀 > hashPassword > salt:", salt);
    return bcrypt.hashSync(password, SALT);
};

export const sendEmail = async (
    to: string,
    options: { subject: string } & (
        | {
              text?: string;
          }
        | { html?: string }
    )
): Promise<SMTPTransport.SentMessageInfo> => {
    return new Promise((res, rej) => {
        emailService.sendMail(
            {
                to,
                ...options,
            },
            (err, info) => {
                if (err) {
                    rej(err);
                } else {
                    res(info);
                }
            }
        );
    });
};
