import {db} from "../database";
import {PlainProgramItem} from "../dto/programDto/plainProgram";
import {ProgramItem} from "../models/program";
import {WorkoutItem} from "../models/workout";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {ExerciseStatus} from "../enums/exercise-status.enum";
import {EditProgramItem} from "../models/edit-program-item";

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

    static async delete(programID: number): Promise<boolean> {
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
        return true;
    }

    static async isActive(userID: number, programID: number) {
        const program = await db('Program')
            .where({'UserID': userID, 'ProgramID': programID});

        return program[0].ProgramStateID === ProgramStateEnum.ACTIVE;
    }

    static async setActiveProgram(userID: number) {
        await db('Program')
            .where('userID', userID)
            .orderBy('ProgramID', 'desc')
            .limit(1)
            .update('ProgramStateID', ProgramStateEnum.ACTIVE);
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

    static async edit(editProgramItem: EditProgramItem): Promise<boolean> {
        console.log(editProgramItem);
        await db('Program')
            .where({'ProgramID': editProgramItem.programID})
            .update({
                'ProgramStateID': editProgramItem.programStateID,
                'Title': editProgramItem.programTitle
            });

        return true;
    }

    //endregion
}
