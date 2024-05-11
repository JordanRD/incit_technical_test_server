import passport from "passport";
import initializeGoogleStrategy from "./googleStrategy";
import Models from "../models";
import initializeFacebookStrategy from "./facebookStrategy";
import { Dependencies } from "../dependencies";
import { UnauthorizedError } from "../models/AppError";
import { getAppError } from "../utils";
import { isNil } from "lodash";
import initializeLocalStrategy from "./localStrategy";

export default function initializePassport(dependencies: Dependencies) {
    passport.use(initializeGoogleStrategy());
    passport.use(initializeFacebookStrategy());
    passport.use(initializeLocalStrategy());

    // convert user from login to session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // convert data from session to user
    passport.deserializeUser(async (userId: number, done) => {
        // console.log("🚀 > passport.deserializeUser > userId:", userId)
        try {
            const user =
                await dependencies.services.userService.getCurrentUserByID(
                    userId
                );
            if (user) {
                done(null, {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    verified: !isNil(user.verified_at),
                    hasPassword: user.hasPassword,
                });
            } else {
                throw new UnauthorizedError("user not found");
            }
        } catch (error) {
            console.error(error);
            done(null, null);
        }
    });
    return passport;
}
