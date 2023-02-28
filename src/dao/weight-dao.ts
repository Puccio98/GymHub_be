import {WeightItem} from "../models/weight";
import {db} from "../database";

export class WeightDao {
    // region Public Methods
    static async findAllWeights(userID: number): Promise<WeightItem[]> {
        return db('Weight').where({userID: userID}).select('*');
    }

    static async findExistingWeight(date: Date): Promise<boolean> {
        const weight = await db('Weight').where({date: date}).select('*');
        return weight.length !== 0;
    }

    static async createNewWeight(weightItem: WeightItem): Promise<boolean> {
        console.log(weightItem);
        await db('Weight').insert(weightItem);
        return db('Weight').where({userID: weightItem.UserID, date: weightItem.Date});
    }

    // endregion
}
