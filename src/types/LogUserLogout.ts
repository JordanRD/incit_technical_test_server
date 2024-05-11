import { Optional } from "sequelize";

export type LogUserLogoutAttributes = {
    id: number;
    user_id: number;
    logout_at: Date;
    created_at: Date;
};

export type LogUserLogoutCreationAttributes = Optional<
    LogUserLogoutAttributes,
    "created_at" | "id"
>;
