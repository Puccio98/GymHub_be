import {FoodDto} from "./food-dto";

export interface FoodQuantityDto extends FoodDto {
    quantity: number;
}