import {db} from "../database";
import {PlainFoodUserItem} from "../plain_item/PlainFoodUserItem";
import {BaseFood_UserItem, Food_UserItem} from "../models/food_user";
import {DateHelper} from "../helpers/DateHelper";

export class FoodUserDao {

    /***
     * Restituisce la lista di alimenti inseriti dall'utente nel giorno di oggi.
     * @param userID
     */
    static async get(userID: number): Promise<PlainFoodUserItem[]> {
        return db('Food_User as f_u')
            .join('Food as f', 'f_u.FoodID', 'f.FoodID')
            .where({UserID: userID, Date: DateHelper.today_string()})
            .select(['f_u.*', 'f.*'])
            .options({nestTables: true});
    }

    /***
     * Cerca un alimento alla data di oggi e al pasto indicato per l'utente che fa la richiesta, se lo trova lo restituisce.
     * @param food
     */
    static async exist(food: BaseFood_UserItem): Promise<Food_UserItem[]> {
        return db('Food_User')
            .where({UserID: food.UserID, FoodID: food.FoodID, Date: DateHelper.today_string(), MealID: food.MealID})
            .select();
    }

    /***
     * Salva l'alimento inserito dall'utente alla giornata di oggi.
     * @param food
     */
    static async create(food: Food_UserItem): Promise<number> {
        return db('Food_User').insert(food);
    }

    /***
     * Aggiorna la quantità dell'alimento inserito.
     * @param food
     */
    static async update(food: Food_UserItem): Promise<number> {
        return db('Food_User')
            .where({Food_UserID: food.Food_UserID})
            .update({Quantity: food.Quantity})
            .select();
    }

    /***
     * Elimina l'alimento filtrando per utente, data e foodID
     * @param userID
     * @param food
     */
    static async delete(userID: number, food: BaseFood_UserItem): Promise<boolean> {
        return db('Food_User')
            .where({FoodID: food.FoodID, MealID: food.MealID, UserID: userID})
            .delete();
    }

}
