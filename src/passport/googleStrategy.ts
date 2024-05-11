import GoogleStrategy from "passport-google-oauth";
import { GOOGLE_CREDS } from "../constants";
import Controllers from "../controllers";

export default function initializeGoogleStrategy() {
    return new GoogleStrategy.OAuth2Strategy(
        {
            callbackURL: GOOGLE_CREDS.CALLBACK_URL,
            clientID: GOOGLE_CREDS.CLIENT_ID,
            clientSecret: GOOGLE_CREDS.CLIENT_SECRET,
            passReqToCallback: true,
        },
        Controllers.userController.loginGoogle
    );
}
