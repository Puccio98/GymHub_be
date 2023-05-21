import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";

import {FoodDao} from "../dao/food-dao";
import {FoodItem} from "../models/food";
import {itemOFF} from "../dto/externalApiDto/OFF/off-dto";
import {itemUSDA} from "../dto/externalApiDto/USDA/usda-dto";
import {NutritionLib} from "../lib_mapping/nutritionLib";


export class NutritionService {
    static async getFood(barcode: string): Promise<ServiceResponse<any>> {
        try {
            let food: FoodItem = await FoodDao.get(barcode);
            // Se lo trova in database lo restituisce
            if (food) {
                return response(ServiceStatusEnum.SUCCESS, '', NutritionLib.FoodItemtoFoodDto(food));
            }

            // Lo cerco su Open food facts
            const itemOFF: itemOFF | null = await FoodDao.getFromOFF(barcode);
            if (itemOFF) {
                food = NutritionLib.OFFItemToFood(itemOFF)
            } else {
                // Se non è in OFF lo cerco su USDA
                const itemUSDA: itemUSDA | null = await FoodDao.getFromUSDA(barcode);
                if (itemUSDA) {
                    food = NutritionLib.USDAItemToFood(itemUSDA);
                }
            }

            if (!food) {
                let message = 'Cibo non trovato :\'(';
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Verifico che l'alimento abbia tutti i campi necessari per l'inserimento altrimenti errore.
            if (!FoodDao.checkCreate(food)) {
                let message = 'Cibo non trovato :\'(';
                return response(ServiceStatusEnum.ERROR, message);
            }

            const foodID: number = await FoodDao.create(food);
            if (!foodID) {
                return response(ServiceStatusEnum.ERROR, 'Internal Server Error');
            }
            food.FoodID = foodID;

            let message = 'Nuovo alimento inserito';
            return response(ServiceStatusEnum.SUCCESS, message, NutritionLib.FoodItemtoFoodDto(food));

        } catch {
            return response(ServiceStatusEnum.ERROR, 'defaultMessage');
        }
    }

}
