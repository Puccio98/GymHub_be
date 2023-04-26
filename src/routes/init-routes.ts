import {Express} from 'express';

export function initRoutes(app: Express) {
    require("./auth-routes")(app);
    require("./program-routes")(app);
    require("./weight-routes")(app);
    require("./workout-routes")(app);
    require("./exercise-routes")(app);
    require("./exercise-workout-routes")(app);
}
