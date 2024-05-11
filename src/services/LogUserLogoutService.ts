import { ServiceProps } from ".";

export default class LogUserLogoutService {
    constructor(private props: ServiceProps) {}

    async createLogoutHistory(userId: number) {
        const resp = await this.props.models.LogUserLogout.create({
            logout_at: new Date(),
            user_id: userId,
        });
        return resp;
    }

    async getLastLogoutByUserIds(userIds: number[]) {
        const dt: {
            user_id: number;
            logout_at: Date;
        }[] = await this.props.models.LogUserLogout.findAll({
            attributes: [
                "user_id",
                [
                    this.props.models.LogUserLogout.sequelize!.fn(
                        "max",
                        this.props.models.LogUserLogout.sequelize!.col(
                            "logout_at"
                        )
                    ),
                    "logout_at",
                ],
            ],
            group: ["user_id"],
            where: {
                user_id: userIds,
            },
            plain: true,
        });
        return dt;
    }
}
