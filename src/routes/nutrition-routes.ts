import {NutritionController} from "../controllers/nutrition-controller";


module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/food/barcode/:barcode', NutritionController.getFood);

    router.get('/food/description/:description', NutritionController.searchFoods);

    app.use('/nutrition', router);
};
