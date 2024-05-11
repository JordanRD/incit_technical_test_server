import { Optional } from "sequelize";

export type UserAttributes = {
    id: number;
    email: string;
    name: string;
    password: string | null;
    register_via: string;
    verified_at: Date | null;
    created_at: Date;
    updated_at: Date;
};

export type LoginEmailInput = {
    password: string;
    email: string;
};

export type RegisterOAuthInput = {
    email: string;
    name: string;
    register_via: string;
};

export type RegisterEmailInput = {
    name: string;
    email: string;
    password: string;
};
export type ChangePasswordInput = {
    oldPassword?: string;
    password: string;
};
export type UserUpdateInput = {
    name: string;
};

export type UserCreationAttributes = Optional<
    UserAttributes,
    "id" | "created_at" | "updated_at" | "password" | "verified_at"
>;

export type CurrentUser = {
    id: number;
    email: string;
    verified: boolean;
    name: string;
    hasPassword: boolean;
};

export type UserDashboard = Pick<
    UserAttributes,
    "id" | "email" | "name" | "created_at"
> & {
    logout_at: Date;
    login_count: Date;
};
