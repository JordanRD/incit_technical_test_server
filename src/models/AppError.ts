import { HTTP_STATUS_CODES } from "../constants";

export default class AppError extends Error {
    scope: string;
    message: string;
    status: number;
    constructor(status: number, message: string, scope = "") {
        super(message);
        this.message = message;
        this.status = status;
        this.scope = scope;
    }
}

export class InternalServerError extends AppError {
    constructor() {
        super(
            HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            "Something wrong in our server!"
        );
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, scope?: string) {
        super(HTTP_STATUS_CODES.UNAUTHORIZED, message, scope);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(HTTP_STATUS_CODES.CONFLICT, message);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, scope?: string) {
        super(HTTP_STATUS_CODES.BAD_REQUEST, message, scope);
    }
}
