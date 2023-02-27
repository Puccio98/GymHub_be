import {db} from "../database";
import {PlainProgramItem} from "../models/plainProgram";


export class ProgramDao {
    // region Public Methods
    static async getProgramListByUserID(userID: number): Promise<PlainProgramItem[]> {
        const res: PlainProgramItem[] = await db('User AS u')
            .join('Program AS p', 'u.UserID', 'p.UserID')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .join('Exercises_Workout AS e_w', 'w.WorkoutID', 'e_w.WorkoutID')
            .join('Exercise AS e', 'e_w.ExerciseID', 'e.ExerciseID')
            .where({'u.UserID': userID})
            .select(['p.*', 'w.*', 'e_w.*', 'e.*'])
            .orderBy(['p.ProgramID', 'w.WorkoutID', 'e_w.Exercise_WorkoutID'])
            .options({nestTables: true});
        return res;
    }

    //endregion
}
