import {Express} from 'express';

export function initRoutes(app: Express) {
    require("./auth-routes")(app);
    require("./nutrition-routes")(app);
    require("./program-routes")(app);
    require("./weight-routes")(app);
    require("./exercise-routes")(app);
    require("./user-routes")(app);
    require("./request-routes")(app);
}
