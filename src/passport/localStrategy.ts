import LocalStrategy from "passport-local";
import Controllers from "../controllers";

export default function initializeLocalStrategy() {
    return new LocalStrategy.Strategy(
        {
            passReqToCallback: true,
            passwordField: "password",
            usernameField: "email",
            session: true,
        },
        Controllers.userController.loginLocal
    );
}
