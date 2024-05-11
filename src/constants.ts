import fs from "fs";
import path from "path";

export const PG_CONFIG = {
    DATABASE: process.env.PG_DATABASE!,
    PORT: +process.env.PG_PORT!,
    USER: process.env.PG_USER!,
    PASSWORD: process.env.PG_PASSWORD!,
    HOST: process.env.PG_HOST!,
    CA: process.env.PG_CA,
};

export const SALT = "$2b$10$Xx3Zg7K2FPLVNzLbKI1vp.";

export const MS = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 60 * 60 * 1000 * 24,
};

export const GOOGLE_CREDS = {
    CLIENT_ID: process.env.GG_CLIENT_ID!,
    CLIENT_SECRET: process.env.GG_CLIENT_SECRET!,
    CALLBACK_URL: process.env.SERVER_URL + "/auth/google/callback",
};
export const FACEBOOK_CREDS = {
    CLIENT_ID: process.env.FB_CLIENT_ID!,
    CLIENT_SECRET: process.env.FB_CLIENT_SECRET!,
    CALLBACK_URL: process.env.SERVER_URL + "/auth/facebook/callback",
};

export const NODEMAILER_CREDS = {
    EMAIL: process.env.NODEMAILER_EMAIL,
    PASSWORD: process.env.NODEMAILER_PASSWORD,
};

export const CLIENT_URL = process.env.CLIENT_URL!;

export const LOGIN_REDIRECT_PATH = CLIENT_URL + "/#/home";

export const PORT = +process.env.PORT!;

export const REGISTER_VIA = {
    email: "email",
    google: "google",
    facebook: "facebook",
};

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
