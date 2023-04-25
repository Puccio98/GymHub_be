import {db} from "../database";
import {PlainProgramItem} from "../models/plainProgram";
import {ProgramItem} from "../models/program";
import {WorkoutItem} from "../models/workout";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {ExerciseStatus} from "../enums/exercise-status.enum";

export class ProgramDao {
    // region Public Methods
    static async getPlainList(userID: number): Promise<PlainProgramItem[]> {
        let res: PlainProgramItem[];
        res = await db('User AS u')
            .join('Program AS p', 'u.UserID', 'p.UserID')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .join('Exercises_Workout AS e_w', 'w.WorkoutID', 'e_w.WorkoutID')
            .join('Exercise AS e', 'e_w.ExerciseID', 'e.ExerciseID')
            .where({'u.UserID': userID})
            .select(['p.*', 'w.*', 'e_w.*', 'e.*'])
            .orderBy([{column: 'p.ProgramID', order: 'desc'},
                {column: 'w.WorkoutID', order: 'asc'},
                {column: 'e_w.Exercise_WorkoutID', order: 'asc'}])
            .options({nestTables: true});
        return res;
    }

    static async getPlainByProgramID(userID: number, programID: number): Promise<PlainProgramItem[]> {
        let res: PlainProgramItem[];
        res = await db('User AS u')
            .join('Program AS p', 'u.UserID', 'p.UserID')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .join('Exercises_Workout AS e_w', 'w.WorkoutID', 'e_w.WorkoutID')
            .join('Exercise AS e', 'e_w.ExerciseID', 'e.ExerciseID')
            .where({'u.UserID': userID, 'p.ProgramID': programID})
            .select(['p.*', 'w.*', 'e_w.*', 'e.*'])
            .orderBy([{column: 'p.ProgramID', order: 'desc'},
                {column: 'w.WorkoutID', order: 'asc'},
                {column: 'e_w.Exercise_WorkoutID', order: 'asc'}])
            .options({nestTables: true});
        return res;
    }

    static async getActiveProgram(userID: number): Promise<number> {
        const res: any[] = await db('Program')
            .where({'UserID': userID, 'ProgramStateID': ProgramStateEnum.ACTIVE})
            .select();

        if (res.length) {
            return res[0].ProgramID;
        }
        return -1;
    }


    /**
     * Restituisce il ProgramID
     * @param programItem
     */
    static async create(programItem: ProgramItem): Promise<number> {
        let res: any = await db('Program').insert(programItem);
        return res[0];
    }


    static async setProgramsInactive(userID: number): Promise<void> {
        await db('Program').where({'UserID': userID})
            .update({
                ProgramStateID: ProgramStateEnum.INACTIVE,
            });
    }

    static async delete(programID: number, userID: number): Promise<boolean> {
        // Verifico che l'utente possieda la scheda che vuole eliminare
        const schedaList: ProgramItem[] = await db('Program as p')
            .where({'p.UserID': userID, 'p.ProgramID': programID})
            .select()

        // Se non ho trovato la scheda da eliminare dall'utente che l'ha richiesta non elimino nulla.
        if (schedaList.length !== 1) {
            return false;
        }

        // Elimino esercizi degli allenamenti della scheda richiesta se l'utente coincide
        await db('Exercises_Workout')
            .join('Workout AS w', 'w.WorkoutID', 'Exercises_Workout.WorkoutID')
            .where({'w.ProgramID': programID})
            .delete();

        // Elimino tutti gli allenamenti della scheda
        await db('Workout')
            .join('Program AS p', 'Workout.ProgramID', 'p.ProgramID')
            .where({'p.ProgramID': programID})
            .delete();

        // Elimino la scheda
        await db('Program')
            .where('ProgramID', programID)
            .delete();

        if (schedaList[0].ProgramStateID === ProgramStateEnum.ACTIVE) {
            //Se la scheda era una scheda attiva, devo poi settare la vecchia scheda più recente come nuova scheda attiva
            await db('Program')
                .where('userID', userID)
                .orderBy('ProgramID', 'desc')
                .limit(1)
                .update('ProgramStateID', ProgramStateEnum.ACTIVE);
        }
        return true;
    }

    static async refresh(programID: number): Promise<boolean> {
        await db('Workout as w')
            .join('Exercises_Workout as ew', 'w.WorkoutID', 'ew.WorkoutID')
            .where({'w.ProgramID': programID})
            .update({
                'w.StatusID': ExerciseStatus.INCOMPLETE,
                'ew.StatusID': ExerciseStatus.INCOMPLETE
            });
        return true;
    }

    static async belongsToUser(userID: number, programID: number): Promise<boolean> {
        const userProgram: any[] = await db('Program')
            .where({
                'ProgramStateID': ProgramStateEnum.ACTIVE,
                'UserID': userID, 'ProgramID': programID
            })
            .select();

        return userProgram.length >= 1;
    }

    static async isComplete(programID: number): Promise<boolean> {
        const uncompletedWorkouts: WorkoutItem[] = await db('Workout')
            .where({'ProgramID': programID, 'StatusID': ExerciseStatus.INCOMPLETE});

        return uncompletedWorkouts.length <= 0;
    }


    //endregion
}
