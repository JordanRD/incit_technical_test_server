import { Sequelize } from "sequelize";
import { PG_CONFIG } from "../constants";

export const sequelize = new Sequelize(
    PG_CONFIG.DATABASE,
    PG_CONFIG.USER,
    PG_CONFIG.PASSWORD,
    {
        port: PG_CONFIG.PORT,
        host: PG_CONFIG.HOST,
        dialect: "postgres",
        schema: "public",
        ssl: true,
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                ca: PG_CONFIG.CA,
            },
        },
    }
);
