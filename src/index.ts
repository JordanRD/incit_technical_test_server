import { config } from "dotenv";
config();
import express, { NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import { CLIENT_URL, MS, NODEMAILER_CREDS, PORT } from "./constants";
import router from "./router";
import "./global";
import initializePassport from "./passport";
import initializeDependencies from "./dependencies";

async function main() {
    const app = express();

    app.use(
        cors({
            origin: [CLIENT_URL],
            credentials: true,
        })
    );

    app.use(
        cookieSession({
            name: "sessid",
            secret: "secret",
            httpOnly: true,
            signed: true,
            secure: true,
            sameSite: "none",
            maxAge: MS.DAY * 7,
        })
    );

    app.use((request, response, next) => {
        if (request.session && !request.session.regenerate) {
            request.session.regenerate = (cb) => {
                cb(null);
                return request.session;
            };
        }
        if (request.session && !request.session.save) {
            request.session.save = (cb) => {
                cb?.(null);
                return request.session;
            };
        }
        next();
    });

    app.use(express.json());

    const dependencies = initializeDependencies();

    const passport = initializePassport(dependencies);

    app.use(passport.session());
    app.use(passport.initialize());

    app.use((req: Request, _: Response, next: NextFunction) => {
        req.services = dependencies.services;
        next();
    });

    app.use((req, resp, next) => {
        console.log(req.session, req.user);
        next();
    });

    app.use(router);

    app.get("/test", (req, res) => {
        res.status(200).json({ lala: 2 });
    });

    app.listen(PORT, () => {
        console.log("server connected on port", PORT);
    });
}

main();
