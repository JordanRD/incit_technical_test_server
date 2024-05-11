import { Transaction } from "sequelize";
import { ServiceProps } from ".";
import { REGISTER_VIA } from "../constants";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
} from "../models/AppError";
import {
    LoginEmailInput,
    RegisterEmailInput,
    RegisterOAuthInput,
    UserDashboard,
} from "../types/User";
import { hashPassword } from "../utils";
import { sequelize } from "../database/pg";
import { isNil } from "lodash";

export default class UserService {
    constructor(private props: ServiceProps) {}

    async changePassword(
        userId: number,
        oldPassword: string | null | undefined,
        newPassword: string
    ) {
        const user = await this.props.models.User.findByPk(userId);
        if (!user) throw new BadRequestError("user not found!");
        if (!isNil(user.password)) {
            if (
                isNil(oldPassword) ||
                user.password !== hashPassword(oldPassword)
            )
                throw new UnauthorizedError("wrong old password!");
        }
        user.password = hashPassword(newPassword);
        await user.save();
        return user;
    }

    async changeName(userId: number, name: string) {
        const [updated] = await this.props.models.User.update(
            {
                name,
            },
            {
                where: {
                    id: userId,
                },
            }
        );
        if (!(updated > 0)) throw new BadRequestError("user not found!");
    }

    async getOrCreateUser(
        input: RegisterOAuthInput,
        transaction?: Transaction
    ) {
        const [user] = await this.props.models.User.findOrCreate({
            where: {
                email: input.email,
            },
            defaults: {
                email: input.email,
                name: input.name,
                verified_at: new Date(),
                register_via: input.register_via,
            },
            transaction,
        });
        return user;
    }

    async getCurrentUserByID(id: number) {
        const user = await this.props.models.User.findByPk(id, {
            attributes: [
                "id",
                "email",
                "verified_at",
                "register_via",
                "name",
                "password",
            ],
        });
        return user;
    }

    async getUserDashboard() {
        const users = await this.props.models.User.findAll({
            attributes: [
                "id",
                "email",
                "name",
                "created_at",
                [
                    sequelize.fn("max", sequelize.col("logoutLogs.logout_at")),
                    "logout_at",
                ],
                [
                    sequelize.fn("count", sequelize.col("loginLogs.id")),
                    "login_count",
                ],
            ],
            include: [
                {
                    model: this.props.models.LogUserLogout,
                    as: "logoutLogs",
                    required: false,
                    attributes: [],
                },
                {
                    model: this.props.models.LogUserLogin,
                    as: "loginLogs",
                    required: false,
                    attributes: [],
                },
            ],
            group: ["User.id"],
            order: [["created_at", "desc"]],
        });

        return users.map((user) => user.get() as any as UserDashboard);
    }

    async loginUserViaEmail({ email, password }: LoginEmailInput) {
        const user = await this.props.models.User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new UnauthorizedError("user not found!", "email");
        }

        if (!user.password) {
            throw new UnauthorizedError(
                "you have not set any password, please login with previous method!",
                "password"
            );
        }

        if (user.password !== hashPassword(password)) {
            throw new UnauthorizedError("wrong password!", "password");
        }
        return user;
    }

    async registerUserViaEmail({ email, name, password }: RegisterEmailInput) {
        const user = await this.props.models.User.findOne({
            where: {
                email: email,
            },
        });

        if (user) {
            throw new ConflictError("email already exist!");
        }

        const newUser = await this.props.models.User.create(
            {
                email: email,
                name: name,
                password: hashPassword(password),
                register_via: REGISTER_VIA.email,
                verified_at: null,
            },
            {
                returning: true,
            }
        );
        return newUser;
    }
}
