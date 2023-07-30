import {WeightController} from "../controllers/weight.controller";
import {validateDto} from "../middlewares/validateDto";
import {weightType} from "../validators/weight-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/get-daily-weights', WeightController.fetchWeightHistory);
    router.post('/post-new-weight', validateDto(weightType), WeightController.postNewWeight);

    app.use('/weight', router);
}
