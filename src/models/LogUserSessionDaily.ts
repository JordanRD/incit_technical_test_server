import { DataTypes, Model } from "sequelize";
import {
    LogUserSessionDailyAttributes,
    LogUserSessionDailyCreationAttributes,
} from "../types/LogUserSessionDaily";
import { sequelize } from "../database/pg";

export default class LogUserSessionDaily
    extends Model<
        LogUserSessionDailyAttributes,
        LogUserSessionDailyCreationAttributes
    >
    implements LogUserSessionDailyAttributes
{
    id!: number;
    user_id!: number;
    active_at!: Date;
    last_active_at!: Date;
    created_at!: Date;
}

LogUserSessionDaily.init(
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
        active_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        last_active_at: {
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
        tableName: "log_user_session_daily",
        sequelize: sequelize,
        updatedAt: false,
    }
);