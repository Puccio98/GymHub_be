import {itemUSDA} from "../dto/externalApiDto/USDA/usda-dto";
import {FoodItem} from "../models/food";
import {NutrientUsdaEnum} from "../enums/nutrient-usda.enum";
import {itemOFF} from "../dto/externalApiDto/OFF/off-dto";
import {FoodDto} from "../dto/nutritionDto/food-dto";

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
            Description: itemOFF.product_name_it ?? itemOFF.product_name,
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

    static FoodItemtoFoodDto(foodItem: FoodItem): FoodDto {
        return {
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


}
