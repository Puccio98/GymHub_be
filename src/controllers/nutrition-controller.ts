import {Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {NutritionService} from "../services/nutrition-service";

export class NutritionController {
    static food = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const barcode: string = req.params.barcode;

        const foodResponse: ServiceResponse<any[]> = await NutritionService.getFood(barcode);

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

