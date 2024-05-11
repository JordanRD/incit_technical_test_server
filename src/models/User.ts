import {
    Association,
    DataTypes,
    Model,
    NonAttribute,
    Optional,
} from "sequelize";
import { sequelize } from "../database/pg";
import { UserAttributes, UserCreationAttributes } from "../types/User";
import { isNil } from "lodash";
import LogUserLogin from "./LogUserLogin";
import LogUserLogout from "./LogUserLogout";
import LogUserSessionDaily from "./LogUserSessionDaily";
import EmailVerification from "./EmailVerification";

export default class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    id!: number;
    email!: string;
    name!: string;
    password!: string | null;
    register_via!: string;
    verified_at!: Date | null;
    created_at!: Date;
    updated_at!: Date;
    get verified() {
        return !isNil(this.verified_at);
    }
    get hasPassword() {
        return !isNil(this.password);
    }

    declare loginLogs?: NonAttribute<LogUserLogin>;
    declare logoutLogs?: NonAttribute<LogUserLogout>;
    declare dailySessionLogs?: NonAttribute<LogUserSessionDaily>;

    declare static associations: {
        loginLogs: Association<User, LogUserLogin>;
        logoutLogs: Association<User, LogUserLogout>;
        dailySessionLogs: Association<User, LogUserSessionDaily>;
    };
}

User.init(
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT(),
        },
        email: {
            allowNull: false,
            type: DataTypes.CHAR(100),
            unique: true,
        },
        name: {
            allowNull: false,
            type: DataTypes.CHAR(100),
        },
        password: {
            allowNull: true,
            type: DataTypes.CHAR(250),
        },
        register_via: {
            allowNull: false,
            type: DataTypes.CHAR(20),
        },
        verified_at: {
            allowNull: true,
            type: DataTypes.DATE,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at",
        tableName: "users",
        sequelize: sequelize,
    }
);
