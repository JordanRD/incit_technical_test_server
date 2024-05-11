import { Optional } from "sequelize";

export type LogUserSessionDailyAttributes = {
    id: number;
    user_id: number;
    active_at: Date;
    last_active_at: Date;
    created_at: Date;
};

export type LogUserSessionDailyCreationAttributes = Optional<
    LogUserSessionDailyAttributes,
    "created_at" | "id"
>;

export type UserSessionCountByDate = {
    date: Date;
    users_count: number;
    today:boolean;
};
