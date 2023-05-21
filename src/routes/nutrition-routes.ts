import {NutritionController} from "../controllers/nutrition-controller";


module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/food/:barcode', NutritionController.food);

    app.use('/nutrition', router);
};
