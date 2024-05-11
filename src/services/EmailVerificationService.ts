import { randomUUID } from "crypto";
import { ServiceProps } from ".";
import { sendEmail } from "../utils";
import { Op, Transaction } from "sequelize";
import { BadRequestError } from "../models/AppError";
import { sequelize } from "../database/pg";

export default class EmailVerificationService {
    constructor(private props: ServiceProps) {}

    async verifyEmail(verificationCode: string) {
        let transaction: Transaction | null = null;
        try {
            transaction = await this.props.models.startTransaction();
            const emailVerification =
                await this.props.models.EmailVerification.findOne({
                    where: {
                        code: verificationCode,
                    },
                    transaction,
                });
            if (!emailVerification) {
                throw new BadRequestError("verification code not found!");
            }
            if (emailVerification.used) {
                throw new BadRequestError(
                    "verification code already used before!"
                );
            }
            if (emailVerification.expired_at < new Date()) {
                throw new BadRequestError("verification code expired!");
            }
            emailVerification.used = true;
            await emailVerification.save({ transaction });
            await this.props.models.User.update(
                {
                    verified_at: new Date(),
                },
                {
                    where: {
                        id: emailVerification.user_id,
                        verified_at: {
                            [Op.is]: null,
                        },
                    },
                    transaction,
                }
            );
            await transaction.commit();
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    async sendEmailVerification(userId: number, email: string) {
        let transaction: Transaction | null = null;
        try {
            transaction = await this.props.models.startTransaction();
            await this.props.models.EmailVerification.update(
                {
                    expired_at: new Date(),
                },
                {
                    where: {
                        user_id: userId,
                    },
                    transaction,
                }
            );
            const code = randomUUID();
            // console.log(
            //     "🚀 > EmailVerificationService > sendEmailVerification > code:",
            //     code
            // );

            const expiredDate = new Date();

            expiredDate.setHours(expiredDate.getHours() + 3);

            await this.props.models.EmailVerification.create(
                {
                    code: code,
                    expired_at: expiredDate,
                    used: false,
                    user_id: userId,
                },
                {
                    transaction,
                }
            );
            const appConfig = await this.props.models.AppConfig.findOne();
            const html = `
            
            <a href="${appConfig?.client_url}/verify-email/${code}" style="
                font-family:Arial, sans-serif;
                display:inline-block;
                border-radius: 0.375rem;
                padding-left: 1.25rem;
                padding-right: 1.25rem;
                padding-top: 0.625rem;
                padding-bottom: 0.625rem;
                text-align: center;
                font-size: 0.875rem;
                line-height: 1.25rem;
                font-weight: 600;
                color: rgb(38 38 38);
                border:2px solid  rgb(38 38 38);
                background-color:white;
            ">
                Verify Your Email
            </a>
        `;
            // email = "jordan.rafelino@gmail.com";
            await sendEmail(email, {
                subject: "Email Verification",
                html,
            });
            await transaction.commit();
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }
}
