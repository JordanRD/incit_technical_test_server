import { Optional } from "sequelize";

export type LogUserLoginAttributes = {
    id: number;
    user_id: number;
    login_at: Date;
    created_at: Date;
};

export type LogUserLoginCreationAttributes = Optional<
    LogUserLoginAttributes,
    "created_at" | "id"
>;
