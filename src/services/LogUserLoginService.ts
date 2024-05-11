import { ServiceProps } from ".";

export default class LogUserLoginService {
    constructor(private props: ServiceProps) {}

    async createLoginHistory(userId: number) {
        try {
            const resp = await this.props.models.LogUserLogin.create({
                user_id: userId,
                login_at: new Date(),
            });
            return resp;
        } catch (error) {
            console.log(
                "🚀 > LogUserLoginService > createLoginHistory > error:",
                error
            );
            return null;
        }
    }
}
