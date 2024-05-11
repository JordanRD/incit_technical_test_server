import { DataTypes, Model } from "sequelize";
import {
    LogUserLoginAttributes,
    LogUserLoginCreationAttributes,
} from "../types/LogUserLogin";
import { sequelize } from "../database/pg";
import User from "./User";

export default class LogUserLogin
    extends Model<LogUserLoginAttributes, LogUserLoginCreationAttributes>
    implements LogUserLoginAttributes
{
    id!: number;
    user_id!: number;
    login_at!: Date;
    created_at!: Date;
}

LogUserLogin.init(
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
        login_at: {
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
        tableName: "log_user_login",
        sequelize: sequelize,
        updatedAt: false,
    }
);
