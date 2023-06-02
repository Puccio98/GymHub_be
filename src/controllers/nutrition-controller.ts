import {Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {NutritionService} from "../services/nutrition-service";
import {FoodDto} from "../dto/nutritionDto/food-dto";
import {DailyFoodDto} from "../dto/nutritionDto/dailyFood-dto";
import {AddFoodDto} from "../dto/nutritionDto/addFood-dto";
import {BaseFoodDto} from "../dto/nutritionDto/base-food-dto";

export class NutritionController {
    static getFood = async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Pulizia stringa codice a barre
        let barcode: string = req.params.barcode;
        if (!barcode) {
            return res.status(400).send({error: 'Bad Request'});
        }
        barcode = barcode.trim().toUpperCase();
        const foodResponse: ServiceResponse<FoodDto> = await NutritionService.getFood(barcode);

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
    static searchFoods = async (req: IGetUserAuthInfoRequest, res: Response) => {
        // Pulizia stringa descrizione
        let description: string = req.params.description;
        if (!description) {
            return res.status(400).send({error: 'Bad Request'});
        }
        description = description.trim();
        const foodResponse: ServiceResponse<FoodDto[]> = await NutritionService.searchFoods(description);

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    /**
     * Restituisce gli alimenti inseriti dall'utente nel giorno 'oggi'
     * @param req
     * @param res
     */
    static getDailyFood = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;

        const foodResponse: ServiceResponse<DailyFoodDto> = await NutritionService.getDailyFood(userJWT.UserID);

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static addDailyFood = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const addFood: AddFoodDto = req.body;

        const foodResponse: ServiceResponse<boolean> = await NutritionService.addDailyFood(userJWT.UserID, addFood);

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
    static deleteDailyFood = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        let foodID: number = Number(req.params.food_id);
        let mealID: number = Number(req.params.meal_id);

        if (!foodID || !mealID) {
            return res.status(400).send({error: 'Parametri della richiesta non validi'});
        }

        const foodResponse: ServiceResponse<boolean> = await NutritionService.deleteDailyFood(userJWT.UserID, {
            FoodID: foodID,
            MealID: mealID,
            UserID: userJWT.UserID
        });

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
    static updateDailyFood = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const food: BaseFoodDto = req.body;

        const foodResponse: ServiceResponse<boolean> = await NutritionService.updateDailyFood(userJWT.UserID, food);

        switch (foodResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(foodResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: foodResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}

