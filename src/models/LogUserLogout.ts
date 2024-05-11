import { Association, DataTypes, Model, NonAttribute } from "sequelize";
import {
    LogUserLogoutAttributes,
    LogUserLogoutCreationAttributes,
} from "../types/LogUserLogout";
import { sequelize } from "../database/pg";
import User from "./User";

export default class LogUserLogout
    extends Model<LogUserLogoutAttributes, LogUserLogoutCreationAttributes>
    implements LogUserLogoutAttributes
{
    id!: number;
    user_id!: number;
    logout_at!: Date;
    created_at!: Date;

    declare user?: NonAttribute<User>;
    declare static associations: {
        user: Association<LogUserLogout, User>;
    };
}

LogUserLogout.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: DataTypes.BIGINT,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        logout_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        createdAt: "created_at",
        tableName: "log_user_logout",
        updatedAt: false,
        sequelize: sequelize,
    }
);
