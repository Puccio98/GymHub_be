import {Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {NutritionService} from "../services/nutrition-service";
import {FoodDto} from "../dto/nutritionDto/food-dto";

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
}

