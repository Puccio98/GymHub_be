import {itemUSDA} from "../dto/externalApiDto/USDA/usda.dto";
import {FoodItem} from "../models/food";
import {NutrientUsdaEnum} from "../enums/nutrient-usda.enum";
import {itemOFF} from "../dto/externalApiDto/OFF/off.dto";
import {FoodDto} from "../dto/nutritionDto/food.dto";
import {PlainFoodUserItem} from "../interfaces/plain-food-user-item";
import {DailyFoodDto, id_to_meal} from "../dto/nutritionDto/dailyFood.dto";
import {FoodQuantityDto} from "../dto/nutritionDto/foodQuantity.dto";
import {AddFoodDto} from "../dto/nutritionDto/addFood.dto";
import {BaseFood_UserItem} from "../models/food_user";
import {BaseFoodDto} from "../dto/nutritionDto/base-food.dto";

export class NutritionLib {
    static USDAItemToFood(itemUSDA: itemUSDA): FoodItem {
        return {
            Description: itemUSDA.description,
            Category: itemUSDA.foodCategory,
            Protein: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.PROTEIN)?.value ?? null,
            Carbo: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.CARBO)?.value ?? null,
            Fat: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.FAT)?.value ?? null,
            Calories: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.CALORIES)?.value ?? null,
            Fiber: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.FIBER)?.value ?? null,
            Starch: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.STARCH)?.value ?? null,
            Sugar: itemUSDA.foodNutrients.find(n => n.foodNutrientId = NutrientUsdaEnum.SUGAR)?.value ?? null,
            fdcId: itemUSDA.fdcId,
            Barcode: itemUSDA.gtinUpc,
        } as FoodItem;
    }

    static OFFItemToFood(itemOFF: itemOFF): FoodItem {
        return {
            Description: itemOFF.product_name,//itemOFF.product_name_it ?? itemOFF.product_name,
            Category: itemOFF.categories_old,
            Protein: itemOFF.nutriments.proteins_100g,
            Carbo: itemOFF.nutriments.carbohydrates_100g,
            Fat: itemOFF.nutriments.fat_100g,
            Calories: itemOFF.nutriments.energy_kcal_100g,
            Fiber: itemOFF.nutriments.fiber_100g,
            Starch: null,
            Sugar: itemOFF.nutriments.sugars_100g,
            fdcId: null,
            Barcode: itemOFF.code,
        } as FoodItem;
    }

    static FoodItemToFoodDto(foodItem: FoodItem): FoodDto {
        return {
            foodID: foodItem.FoodID,
            description: foodItem.Description,
            category: foodItem.Category,
            protein: foodItem.Protein,
            carbo: foodItem.Carbo,
            fat: foodItem.Fat,
            calories: foodItem.Calories,
            fiber: foodItem.Fiber,
            starch: foodItem.Starch,
            sugar: foodItem.Sugar,
            fdcId: foodItem.fdcId,
            barcode: foodItem.Barcode,
        } as FoodDto;
    }

    static FoodItemListToFoodDtoList(foods: FoodItem[]): FoodDto[] {
        const foodDtoList: FoodDto[] = [];
        for (const food of foods) {
            foodDtoList.push(this.FoodItemToFoodDto(food));
        }
        return foodDtoList;
    }

    static PlainFoodUserItemListToDailyFoodDto(foods: PlainFoodUserItem[]): DailyFoodDto {
        const res: DailyFoodDto = {colazione: [], pranzo: [], cena: [], snack: []}
        for (const food of foods) {
            const foodQuantity = this.PlainFoodUserItemToFoodQuantityDto(food);
            // @ts-ignore
            res[id_to_meal[food.f_u.MealID]].push(foodQuantity);
        }
        return res;
    }

    static PlainFoodUserItemToFoodQuantityDto(plainFood: PlainFoodUserItem): FoodQuantityDto {
        return {
            foodID: plainFood.f.FoodID,
            description: plainFood.f.Description,
            category: plainFood.f.Category,
            protein: plainFood.f.Protein,
            carbo: plainFood.f.Carbo,
            fat: plainFood.f.Fat,
            calories: plainFood.f.Calories,
            fiber: plainFood.f.Fiber,
            starch: plainFood.f.Starch,
            sugar: plainFood.f.Sugar,
            fdcId: plainFood.f.fdcId,
            barcode: plainFood.f.Barcode,
            quantity: plainFood.f_u.Quantity
        } as FoodQuantityDto;
    }

    static AddFoodDtoToFood_UserItem(userID: number, food: AddFoodDto) {
        return {
            FoodID: food.foodID,
            UserID: userID,
            Quantity: food.quantity,
            MealID: food.mealID,
            Date: food.date,
            createdAt: food.createdAt,
            updatedAt: food.updatedAt
        }
    }

    static BaseFoodDtoToBaseFood_UserItem(food: BaseFoodDto): BaseFood_UserItem {
        return {
            FoodID: food.foodID,
            MealID: food.mealID,
            UserID: food.userID,
            Quantity: food.quantity
        };
    }


}
