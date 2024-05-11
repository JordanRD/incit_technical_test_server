import { Database } from "../database";
import Models from "../models";
import EmailVerificationService from "./EmailVerificationService";
import LogUserLoginService from "./LogUserLoginService";
import LogUserLogoutService from "./LogUserLogoutService";
import UserService from "./UserService";
import LogUserSessionDailyService from "./UserSessionDailyService";

export type ServiceProps = {
    models: Models;
};

export default class Services {
    userService: UserService;
    logUserLogoutService: LogUserLogoutService;
    emailVerificationService: EmailVerificationService;
    logUserLoginService: LogUserLoginService;
    logUserSessionDailyService: LogUserSessionDailyService;
    constructor(private props: ServiceProps) {
        this.userService = new UserService(props);
        this.logUserLogoutService = new LogUserLogoutService(props);
        this.emailVerificationService = new EmailVerificationService(props);
        this.logUserLoginService = new LogUserLoginService(props);
        this.logUserSessionDailyService = new LogUserSessionDailyService(props);
    }
}
