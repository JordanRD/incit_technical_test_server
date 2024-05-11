import { Database } from "./database";
import Models from "./models";
import Services from "./services";

export type Dependencies = {
    models: Models;
    services: Services;
};

export default function initializeDependencies():Dependencies {
    Database.connect();
    const models = new Models();
    const services = new Services({ models });
    return {
        models,
        services,
    };
}
