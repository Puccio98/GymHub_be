import {WeightItem} from "../models/weight";
import {db} from "../database";

export class WeightDao {
    // region Public Methods
    static async findAllWeights(userID: number): Promise<WeightItem[]> {
        return db('Weight').where({userID: userID}).select('*');
    }

    static async findExistingWeight(date: Date, userID: number): Promise<boolean> {
        const weight = await db('Weight').where({date: date, userID: userID}).select('*');
        return weight.length !== 0;
    }

    static async createNewWeight(weightItem: WeightItem): Promise<boolean> {
        await db('Weight').insert(weightItem);
        return db('Weight').where({userID: weightItem.UserID, date: weightItem.Date});
    }

    // endregion
}
