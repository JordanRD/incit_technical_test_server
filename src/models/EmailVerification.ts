import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/pg";
import {
    EmailVerificationAttributes,
    EmailVerificationCreationAttributes,
} from "../types/EmailVerification";
import User from "./User";

export default class EmailVerification
    extends Model<
        EmailVerificationAttributes,
        EmailVerificationCreationAttributes
    >
    implements EmailVerificationAttributes
{
    id!: number;
    user_id!: number;
    code!: string;
    expired_at!: Date;
    used!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

EmailVerification.init(
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT,
        },
        code: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        expired_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        used: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
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
        tableName: "email_verification",
        sequelize: sequelize,
    }
);
