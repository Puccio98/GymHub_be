import {ExerciseItem} from "../models/exercise";
import {db} from "../database";

export class ExerciseDao {
    static async getList(): Promise<ExerciseItem[]> {
        return db('Exercise AS e')
            .select('*');
    }
}
