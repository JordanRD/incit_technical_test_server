import { Sequelize } from "sequelize";
import { sequelize } from "./pg";

export class Database {
    static sequelize = sequelize;

    // constructor() {
    //     this.sequelize = sequelize;
    // }

    static connect() {
        Database.sequelize
            .authenticate()
            .then(() => {
                console.log("Sequelize Connected");
                // Database.sequelize.sync();
            })
            .catch((err) => console.error(err));
    }
}
