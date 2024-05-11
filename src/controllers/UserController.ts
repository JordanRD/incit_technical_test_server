import { Request, Response } from "express";
import {
    UserUpdateInput,
    ChangePasswordInput,
    CurrentUser,
    LoginEmailInput,
    RegisterEmailInput,
} from "../types/User";
import { createResponse, createResponseFromError, getAppError } from "../utils";
import { HTTP_STATUS_CODES, REGISTER_VIA } from "../constants";
import {
    validateChangePasswordData,
    validateRegistrationData,
    validateUpdateUserData,
} from "../validators/UserValidator";
import passport, { Profile } from "passport";
import { InternalServerError, UnauthorizedError } from "../models/AppError";
import { Response as AppResponse } from "../types/General";

import { attempt, get } from "lodash";
import { Dependencies } from "../dependencies";
import { VerifyFunction as GoogleVerifyFunction } from "passport-google-oauth";
import { VerifyFunctionWithRequest as FacebookVerifyFunction } from "passport-facebook";
import { VerifyFunctionWithRequest as LocalVerifyFunction } from "passport-local";
export default class UserController {
    static loginFacebook: FacebookVerifyFunction = async (
        req,
        accessToken,
        refreshToken,
        profile,
        done
    ) => {
        // console.log("🚀 > profile:", profile);
        try {
            const email: string = get(profile, ["emails", 0, "value"]);
            if (!email) {
                throw new UnauthorizedError("invalid email");
            }

            const user = await req.services.userService.getOrCreateUser({
                email: email,
                name: profile.displayName,
                register_via: REGISTER_VIA.facebook,
            });

            const currentUser: CurrentUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                verified: user.verified,
                hasPassword: user.hasPassword,
            };
            done(null, currentUser);
            await req.services.logUserLoginService.createLoginHistory(user.id);
        } catch (error) {
            const err = getAppError(error);
            done(err, false, { message: err.message });
        }
    };

    static loginGoogle = async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: GoogleVerifyFunction
    ) => {
        // console.log("🚀 > profile:", profile);
        try {
            const email: string = get(profile, ["emails", 0, "value"]);
            if (!email) {
                throw new UnauthorizedError("invalid email");
            }
            const user = await req.services.userService.getOrCreateUser({
                email: email,
                name: profile.displayName,
                register_via: REGISTER_VIA.google,
            });
            const currentUser: CurrentUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                verified: user.verified,
                hasPassword: user.hasPassword,
            };
            done(null, currentUser);
            console.log('called')
            await req.services.logUserLoginService.createLoginHistory(user.id);
        } catch (error) {
            console.log("🚀 > error:", error);
            const err = getAppError(error);
            done(err, false, { message: err.message });
        }
    };

    static async currentUser(
        req: Request<{}, {}, LoginEmailInput>,
        res: Response
    ) {
        let appResponse: AppResponse;
        if (req.user) {
            appResponse = createResponse();
            appResponse.data = req.user;
        } else {
            appResponse = createResponseFromError(
                new UnauthorizedError("user not logged in")
            );
        }
        res.status(appResponse.status).json(appResponse);
    }

    static async changePassword(
        req: Request<{}, {}, ChangePasswordInput>,
        res: Response
    ) {
        try {
            validateChangePasswordData(req.body);
            await req.services.userService.changePassword(
                req.user!.id,
                req.body.oldPassword,
                req.body.password
            );
            const response = createResponse();
            res.status(response.status).json(response);
        } catch (error) {
            console.log("🚀 > UserController > error:", error);
            const response = createResponseFromError(error);
            res.status(response.status).json(response);
        }
    }
    static async update(req: Request<{}, {}, UserUpdateInput>, res: Response) {
        try {
            validateUpdateUserData(req.body);
            await req.services.userService.changeName(
                req.user!.id,
                req.body.name
            );
            const response = createResponse();
            res.status(response.status).json(response);
        } catch (error) {
            console.log("🚀 > UserController > error:", error);
            const response = createResponseFromError(error);
            res.status(response.status).json(response);
        }
    }

    static loginLocal: LocalVerifyFunction = async (
        req,
        email,
        password,
        done
    ) => {
        try {
            const user = await req.services.userService.loginUserViaEmail({
                email: email,
                password: password,
            });
            const currentUser: CurrentUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                verified: user.verified,
                hasPassword: user.hasPassword,
            };
            req.logIn(currentUser, async (err) => {
                if (err) return done(err, false, { message: err.message });
                done(null, currentUser);
                await req.services.logUserLoginService.createLoginHistory(
                    user.id
                );
            });
        } catch (error) {
            console.log("🚀 > UserController > error:", error);
            const err = getAppError(error);
            done(err, false, { message: err.message });
        }
    };

    static async login(req: Request<{}, {}, LoginEmailInput>, res: Response) {
        const cb = (err: unknown) => {
            if (err) {
                const errorResponse = createResponseFromError(err);
                res.status(errorResponse.status).json(errorResponse);
            } else {
                const response = createResponse();
                res.status(response.status).json(response);
            }
        };
        passport.authenticate("local", cb)(req, res);
    }

    static async register(
        req: Request<{}, {}, RegisterEmailInput>,
        resp: Response
    ) {
        try {
            validateRegistrationData(req.body);
            const user = await req.services.userService.registerUserViaEmail(
                req.body
            );
            await Promise.allSettled([
                req.services.emailVerificationService.sendEmailVerification(
                    user.id,
                    user.email
                ),
            ]);
            const response = createResponse(HTTP_STATUS_CODES.CREATED);

            resp.status(response.status).json(response);
        } catch (error) {
            console.error("🚀 > UserController > error:", error);
            const response = createResponseFromError(error);
            resp.status(response.status).json(response);
        }
    }

    static async getUserDashboard(
        req: Request<{}, {}, RegisterEmailInput>,
        res: Response
    ) {
        try {
            const response = createResponse();

            const sessionCount =
                await req.services.logUserSessionDailyService.getLast7DaysActiveSessionCount();
            const todaysSession = sessionCount.find((v) => v.today);

            const users = await req.services.userService.getUserDashboard();

            const activeSessionsCount = sessionCount.reduce(
                (p, current) => p + +current.users_count,
                0
            );

            const statisticData = {
                todaysUsersCount: +(todaysSession?.users_count || 0),
                averageUsersLast7Days: Math.ceil(
                    activeSessionsCount > 0 ? activeSessionsCount / 7 : 0
                ),
                usersCount: users.length,
            };
            
            response.data = {
                statistic: statisticData,
                users,
            };
            res.status(response.status).json(response);
        } catch (error) {
            const response = createResponseFromError(error);
            res.status(response.status).json(response);
        }
    }

    static async logout(req: Request, res: Response) {
        const userId = req.user!.id;
        req.logOut({ keepSessionInfo: false }, async (err) => {
            try {
                if (err) throw new InternalServerError();
                await req.services.logUserLogoutService.createLogoutHistory(
                    userId
                );
                const response = createResponse();
                res.status(response.status).json(response);
            } catch (error) {
                console.log("🚀 > UserController > req.logOut > error:", error);
                const response = createResponseFromError(error);
                res.status(response.status).json(response);
            }
        });
    }
}
