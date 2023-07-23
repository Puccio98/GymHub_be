import {db} from "../database";
import {RequestItem} from "../models/request";

export class RequestDao {
    // region Public Methods
    static async create(requestItem: RequestItem): Promise<number> {
        let res: any = await db('Request').insert(requestItem);
        return res[0];
    }

    // endregion
}
