import {FoodQuantityDto} from "./foodQuantity-dto";

export interface DailyFoodDto {
    colazione: FoodQuantityDto[],
    pranzo: FoodQuantityDto[],
    cena: FoodQuantityDto[],
    snack: FoodQuantityDto[],
}

export const id_to_meal = {1: 'colazione', 2: 'pranzo', 3: 'cena', 4: 'snack'}
