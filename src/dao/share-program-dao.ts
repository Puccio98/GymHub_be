import {db} from "../database";
import {ShareProgram} from "../models/shareProgram";

export class ShareProgramDao {

    /**
     * Restituisce l'ID del record creato
     * @param shareProgramItem
     */
    static async create(shareProgramItem: ShareProgram): Promise<number> {
        let res: any = await db('ShareProgram').insert(shareProgramItem);
        return res[0];
    }

}