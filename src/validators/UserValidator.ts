import { BadRequestError } from "../models/AppError";
import {
    ChangePasswordInput,
    LoginEmailInput,
    RegisterEmailInput,
    UserUpdateInput,
} from "../types/User";

export const validateEmail = (email: string) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
        return "invalid email";
    return null;
};

export const validatePassword = (password: string) => {
    if (!password) return "enter password";
    if (password.length < 8) return "password must at least 8 character";
    if (!/[a-z]/g.test(password)) return "password must contain lowercase";
    if (!/[A-Z]/g.test(password)) return "password must contain uppercase";
    if (!/\d/g.test(password)) return "password must contain digit";
    if (!/[\W_]/g.test(password)) return "password must contain symbols";
    return null;
};

export const validateChangePasswordData = (
    passwordInput: ChangePasswordInput
) => {
    const passwordErr = validatePassword(passwordInput.password);
    if (passwordErr) {
        throw new BadRequestError(passwordErr, "password");
    }
};

export const validateRegistrationData = (registerInput: RegisterEmailInput) => {
    if (!registerInput.name) {
        throw new BadRequestError("enter name", "name");
    }
    const emailErr = validateEmail(registerInput.email);
    if (emailErr) {
        throw new BadRequestError(emailErr, "email");
    }
    const passwordErr = validatePassword(registerInput.password);
    if (passwordErr) {
        throw new BadRequestError(passwordErr, "password");
    }
};

export const validateUpdateUserData = (updateUserInput: UserUpdateInput) => {
    if (!updateUserInput.name) {
        throw new BadRequestError("enter name", "name");
    }
};
export const validateLoginData = (registerInput: LoginEmailInput) => {
    if (!registerInput.email) {
        throw new BadRequestError("enter email", "email");
    }
    if (!registerInput.password) {
        throw new BadRequestError("enter password", "password");
    }
};
