import {FoodQuantityDto} from "./foodQuantity-dto";

export interface DailyFoodDto {
    Colazione: FoodQuantityDto[],
    Pranzo: FoodQuantityDto[],
    Cena: FoodQuantityDto[],
    Snack: FoodQuantityDto[],
}