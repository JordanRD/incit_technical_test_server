import { DataTypes, Model } from "sequelize";
import { AppConfigAttributes } from "../types/AppConfig";
import { sequelize } from "../database/pg";

export default class AppConfig
    extends Model<AppConfigAttributes, AppConfigAttributes>
    implements AppConfigAttributes
{
    id!: number;
    client_url!: string;
}

AppConfig.init(
    {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
        },
        client_url: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: false,
        updatedAt: false,   
        tableName: "app_config",
        sequelize: sequelize,
    }
);
