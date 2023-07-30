import {NutritionController} from "../controllers/nutrition.controller";
import {validateDtoMiddleware} from "../middlewares/validate-dto.middleware";
import {addDailyFoodType} from "../validators/add-daily-food-validator";
import {baseDailyFoodType} from "../validators/delete-daily-food-validator";

module.exports = (app: { use: (arg0: string, arg1: any) => void; }) => {
    const router = require("express").Router();

    router.get('/food/barcode/:barcode', NutritionController.getFood);

    router.get('/food/description/:description', NutritionController.searchFoods);

    router.get('/daily_food', NutritionController.getDailyFood);

    router.post('/daily_food', validateDtoMiddleware(addDailyFoodType), NutritionController.addDailyFood);

    router.patch('/daily_food', validateDtoMiddleware(baseDailyFoodType), NutritionController.updateDailyFood);

    router.delete('/daily_food/:food_id/meal/:meal_id', NutritionController.deleteDailyFood);

    app.use('/nutrition', router);
};
