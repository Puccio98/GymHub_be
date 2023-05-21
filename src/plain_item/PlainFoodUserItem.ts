import {Food_UserItem} from "../models/food_user";
import {FoodItem} from "../models/food";
import {MealItem} from "../models/meal";

export interface PlainFoodUserItem {
    f_u: Food_UserItem,
    f: FoodItem
    m: MealItem
}