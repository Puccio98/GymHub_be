import {WeightController} from "../controllers/weight.controller";
import {validateDtoMiddleware} from "../middlewares/validate-dto.middleware";
import {weightType} from "../validators/weight-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/get-daily-weights', WeightController.fetchWeightHistory);
    router.post('/post-new-weight', validateDtoMiddleware(weightType), WeightController.postNewWeight);

    app.use('/weight', router);
}
