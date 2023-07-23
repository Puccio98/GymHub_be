import {db} from "../database";
import {RequestItem} from "../models/request";
import {RequestOptions} from "../interfaces/requestOptions-interface";
import {PlainRequest} from "../interfaces/PlainRequest-interface";

export class RequestDao {
    // region Public Methods


    static async get(requestOptions: RequestOptions): Promise<PlainRequest[]> {
        return db('Request AS r')
            .join('User AS u_t', 'r.ToUserID', 'u_t.UserID')
            .where((builder: any) => {
                if (requestOptions.FromUserID)
                    builder.where('r.FromUserID', requestOptions.FromUserID);

                if (requestOptions.ToUserID)
                    builder.andWhere('r.ToUserID', requestOptions.ToUserID);

                if (requestOptions.RequestState)
                    builder.andWhere('r.RequestStateID', requestOptions.RequestState);

                if (requestOptions.RequestType)
                    builder.andWhere('r.RequestType', requestOptions.RequestType);
            })
            .select(['r.*', 'u_t.*'])
            .options({nestTables: true});
    }

    static async create(requestItem: RequestItem): Promise<number> {
        let res: any = await db('Request').insert(requestItem);
        return res[0];
    }

    // endregion
}
