import { Request } from "express";
import Services from "./services";
import { CurrentUser } from "./types/User";

declare global {
    namespace Express {
        interface Request {
            services: Services;
        }
        interface User extends CurrentUser {}
    }
}
