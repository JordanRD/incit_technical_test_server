import { Optional } from "sequelize";

export type EmailVerificationAttributes = {
    id: number;
    user_id: number;
    code: string;
    expired_at: Date;
    used: boolean;
    created_at: Date;
    updated_at: Date;

};

// export type EmailVerificationCodeInput = {
    
// }

export type EmailVerificationCreationAttributes = Optional<
    EmailVerificationAttributes,
    "id" | "created_at" | "updated_at"
>;
