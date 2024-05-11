import FacebookStrategy from "passport-facebook";
import { FACEBOOK_CREDS } from "../constants";
import Controllers from "../controllers";

export default function initializeFacebookStrategy() {
    return new FacebookStrategy.Strategy(
        {
            clientID: FACEBOOK_CREDS.CLIENT_ID,
            clientSecret: FACEBOOK_CREDS.CLIENT_SECRET,
            callbackURL: FACEBOOK_CREDS.CALLBACK_URL,
            profileFields: ["id", "email", "displayName", "photos"],
            passReqToCallback: true,
        },
        // (a,b,c,v)=>{}
        Controllers.userController.loginFacebook
    );
}
