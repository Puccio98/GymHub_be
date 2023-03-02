import {WeightItem} from "../models/weight";
import {db} from "../database";
import {ChartItem} from "../models/chart-item";

export class WeightDao {
    // region Public Methods
    static async findAllWeights(userID: number): Promise<ChartItem[]> {
        return db('Weight')
            .where({userID: userID})
            .select('date AS x', 'weight AS y')
            .orderBy(['X']);
    }

    static async findIfWeightExists(date: Date, userID: number): Promise<boolean> {
        const weight = await db('Weight').where({date: date, userID: userID}).select('*');
        return weight.length !== 0;
    }

    static async createNewWeight(weightItem: WeightItem): Promise<boolean> {
        await db('Weight').insert(weightItem);
        return true;
    }

    // endregion
}
