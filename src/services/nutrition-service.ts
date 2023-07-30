import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";

import {FoodDao} from "../dao/food.dao";
import {FoodItem} from "../models/food";
import {itemOFF} from "../dto/externalApiDto/OFF/off.dto";
import {itemUSDA} from "../dto/externalApiDto/USDA/usda.dto";
import {NutritionLib} from "../lib_mapping/nutritionLib";
import {FoodDto} from "../dto/nutritionDto/food.dto";
import {FoodUserDao} from "../dao/food-user.dao";
import {PlainFoodUserItem} from "../plain_item/PlainFoodUserItem";
import {DailyFoodDto} from "../dto/nutritionDto/dailyFood.dto";
import {AddFoodDto} from "../dto/nutritionDto/addFood.dto";
import {BaseFood_UserItem, Food_UserItem} from "../models/food_user";
import {BaseFoodDto} from "../dto/nutritionDto/base-food.dto";


export class NutritionService {

    static async searchFoods(description: string): Promise<ServiceResponse<FoodDto[]>> {
        try {
            let foods: FoodItem[] = await FoodDao.search(description);
            // Restituisce i cibi in base alla descrizione o array vuoto
            return response(ServiceStatusEnum.SUCCESS, 'Lista di alimenti', NutritionLib.FoodItemListToFoodDtoList(foods));
        } catch (e) {
            return response(ServiceStatusEnum.ERROR, 'DB error');
        }
    }

    static async getFood(barcode: string): Promise<ServiceResponse<FoodDto>> {
        try {
            let food: FoodItem = await FoodDao.get(barcode);
            // Se lo trova in database lo restituisce
            if (food) {
                return response(ServiceStatusEnum.SUCCESS, '', NutritionLib.FoodItemToFoodDto(food));
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
            return response(ServiceStatusEnum.SUCCESS, message, NutritionLib.FoodItemToFoodDto(food));

        } catch {
            return response(ServiceStatusEnum.ERROR, 'defaultMessage');
        }
    }

    static async getDailyFood(userID: number): Promise<ServiceResponse<DailyFoodDto>> {
        try {
            // Restituisce i cibi dell'utente inseriti nella giornata di oggi + la quantità
            let foods: PlainFoodUserItem[] = await FoodUserDao.get(userID);
            return response(ServiceStatusEnum.SUCCESS, 'Lista di alimenti', NutritionLib.PlainFoodUserItemListToDailyFoodDto(foods));
        } catch (e) {
            return response(ServiceStatusEnum.ERROR, 'DB error');
        }
    }

    static async addDailyFood(userID: number, addFood: AddFoodDto): Promise<ServiceResponse<boolean>> {
        try {
            let food: Food_UserItem = NutritionLib.AddFoodDtoToFood_UserItem(userID, addFood);
            // Verifica se l'alimento è già stato inserito nella giornata di oggi e nel meal indicato
            let foodDB: Food_UserItem[] = await FoodUserDao.exist(food);
            let foodUserID: number;
            if (foodDB.length) {
                // Modifica il record già presente
                foodDB[0].Quantity += food.Quantity;
                foodUserID = await FoodUserDao.update(foodDB[0]);
            } else {
                // Se non lo trova lo inserisce
                foodUserID = await FoodUserDao.create(food);
            }
            if (foodUserID) {
                return response(ServiceStatusEnum.SUCCESS, 'Alimento salvato', true);
            } else {
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile inserire l\'alimento', false);
            }
        } catch (e) {
            return response(ServiceStatusEnum.ERROR, 'DB error', false);
        }
    }

    static async updateDailyFood(userID: number, food: BaseFoodDto): Promise<ServiceResponse<boolean>> {
        try {
            let foodDB: Food_UserItem[] = await FoodUserDao.exist(NutritionLib.BaseFoodDtoToBaseFood_UserItem(food));
            if (!foodDB.length) {
                return response(ServiceStatusEnum.ERROR, 'Alimento non trovato', false);
            }
            //Aggiorno la quantità
            const updateFood = foodDB[0];
            updateFood.Quantity = food.quantity;
            let res: number = await FoodUserDao.update(updateFood);
            if (res) {
                return response(ServiceStatusEnum.SUCCESS, 'Alimento modificato correttamente', true);
            } else {
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile modificare l\'alimento', false);
            }
        } catch (e) {
            return response(ServiceStatusEnum.ERROR, 'DB error', false);
        }
    }

    static async deleteDailyFood(userID: number, food: BaseFood_UserItem): Promise<ServiceResponse<boolean>> {
        try {
            let res: boolean = await FoodUserDao.delete(userID, food);
            if (res) {
                return response(ServiceStatusEnum.SUCCESS, 'Alimento eliminato correttamente', true);
            } else {
                return response(ServiceStatusEnum.ERROR, 'Non è stato possibile eliminare l\'alimento', false);
            }
        } catch (e) {
            return response(ServiceStatusEnum.ERROR, 'DB error', false);
        }
    }

}
