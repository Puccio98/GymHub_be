import {WeightController} from "../controllers/weight-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    // region POST routes
    router.post('/get-daily-weights', WeightController.fetchWeightHistory);
    router.post('/post-new-weight', WeightController.postNewWeight);
    // endregion

    app.use('/weight', router);
}
