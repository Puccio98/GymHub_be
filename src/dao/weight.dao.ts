import {WeightItem} from "../models/weight";
import {db} from "../database";
import {ChartInterface} from "../interfaces/chart.interface";

export class WeightDao {
    // region Public Methods
    static async findAllWeights(userID: number): Promise<ChartInterface[]> {
        return db('Weight')
            .where({UserID: userID})
            .select('date AS x', 'weight AS y')
            .orderBy(['X']);
    }

    static async findIfWeightExists(date: Date, userID: number): Promise<WeightItem> {
        date.setHours(0, 0, 0, 0);
        const exWeight = await db('Weight').where({date: date, userID: userID}).select('*');
        return exWeight[0];
    }

    static async createNewWeight(weightItem: WeightItem): Promise<boolean> {
        weightItem.Date.setHours(0, 0, 0, 0);
        await db('Weight').insert(weightItem);
        return true;
    }

    static async updateWeight(weightItem: WeightItem, newWeight: number): Promise<boolean> {
        await db('Weight')
            .where('WeightID', '=', weightItem.WeightID!)
            .update({Weight: newWeight});
        return true;
    }

    // endregion
}
