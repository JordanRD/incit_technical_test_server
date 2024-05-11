import { literal, Op, QueryTypes, Transaction } from "sequelize";
import { ServiceProps } from ".";
import moment from "moment";
import { UserSessionCountByDate } from "../types/LogUserSessionDaily";

export default class LogUserSessionDailyService {
    constructor(private props: ServiceProps) {}

    async getLast7DaysActiveSessionCount() {
        try {
            const countByDate =
                await this.props.models.LogUserSessionDaily.sequelize?.query<UserSessionCountByDate>(
                    `
                select
                    active_at::date date,
                    count(user_id) users_count,
                    active_at::date =now()::date today
                from
                    ${this.props.models.LogUserSessionDaily.getTableName()}
                where
                    active_at::date >= now() - interval '7 day'and 
                    active_at::date <= now() 
                group by
                    active_at::date
                order by active_at::date desc
            `,
                    {
                        type: QueryTypes.SELECT,
                    }
                );
            return countByDate || [];
        } catch (error) {
            console.log(
                "🚀 > LogUserSessionDailyService > getLast7DaysActiveSessionCount > error:",
                error
            );
            return [];
        }
    }

    async createLog(userId: number) {
        let transaction: Transaction | null = null;
        try {
            const now = moment.utc();
            const nowDate = now.toDate();
            transaction = await this.props.models.startTransaction();
            const [logSession, created] =
                await this.props.models.LogUserSessionDaily.findOrCreate({
                    where: {
                        [Op.and]: [
                            {
                                user_id: userId,
                            },
                            literal(`active_at::date = ?`),
                        ],
                    },
                    defaults: {
                        active_at: nowDate,
                        last_active_at: nowDate,
                        user_id: userId,
                    },
                    replacements: [nowDate],
                    transaction,
                });
            if (!created) {
                logSession.last_active_at = nowDate;
                await logSession.save({ transaction });
            }
            await transaction.commit();
            return logSession;
        } catch (error) {
            console.log(
                "🚀 > LogUserSessionDailyService > createLog > error:",
                error
            );
            if (transaction) await transaction.rollback();
            return null;
        }
    }
}
