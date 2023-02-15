import {Express} from 'express';

export function initRoutes(app: Express) {
    require("./auth-routes")(app);
    require("./scheda-routes")(app);
    require("./program-routes")(app);
}
