import {db} from "../database";
import {PlainFoodUserItem} from "../plain_item/PlainFoodUserItem";

export class FoodUserDao {

    /***
     * Restituisce la lista di alimenti inseriti dall'utente nel giorno di oggi.
     * @param userID
     */
    static async get(userID: number): Promise<PlainFoodUserItem[]> {
        const today: string = new Date().toISOString().slice(0, 10);
        return db('Food_User as f_u')
            .join('Food as f', 'f_u.FoodID', 'f.FoodID')
            .join('Meal as m', 'f_u.MealID', 'm.ID')
            .where({UserID: userID, Date: today})
            .select(['f_u.*', 'f.*', 'm.*'])
            .options({nestTables: true});
    }

}