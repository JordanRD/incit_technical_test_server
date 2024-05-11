import { sequelize } from "../database/pg";
import AppConfig from "./AppConfig";
import EmailVerification from "./EmailVerification";
import LogUserLogin from "./LogUserLogin";
import LogUserLogout from "./LogUserLogout";
import LogUserSessionDaily from "./LogUserSessionDaily";
import User from "./User";

export default class Models {
    User = User;
    EmailVerification = EmailVerification;
    LogUserLogout = LogUserLogout;
    LogUserLogin = LogUserLogin;
    LogUserSessionDaily = LogUserSessionDaily;
    AppConfig = AppConfig;

    constructor() {
        this.associate();
    ;
    }

    associate() {
        this.User.hasMany(LogUserLogin, {
            foreignKey: "user_id",
            as: "loginLogs",
        });
        this.User.hasMany(LogUserLogout, {
            foreignKey: "user_id",
            as: "logoutLogs",
        });

        this.User.hasMany(LogUserSessionDaily, {
            foreignKey: "user_id",
            as: "dailySessionLogs",
        });

        this.User.hasMany(EmailVerification, {
            foreignKey: "user_id",
            as: "emailVerifications",
        });

        this.LogUserSessionDaily.belongsTo(User, {
            targetKey: "id",
            foreignKey: "user_id",
            as: "user",
        });

        this.LogUserLogout.belongsTo(User, {
            targetKey: "id",
            foreignKey: "user_id",
            as: "user",
        });

        this.LogUserLogin.belongsTo(User, {
            targetKey: "id",
            foreignKey: "user_id",
            as: "user",
        });

        this.EmailVerification.belongsTo(User, {
            targetKey: "id",
            foreignKey: "user_id",
            as: "user",
        });
    }

    startTransaction() {
        return sequelize.transaction();
    }
}
