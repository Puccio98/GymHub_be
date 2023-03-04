import {WeightController} from "../controllers/weight-controller";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();
    const validateDto = require('../middlewares/validateDto');

    const weightValidator = require('../validators/weight-validator');

    // region POST routes
    router.post('/get-daily-weights', WeightController.fetchWeightHistory);
    router.post('/post-new-weight', validateDto(weightValidator), WeightController.postNewWeight);
    // endregion

    app.use('/weight', router);
}
