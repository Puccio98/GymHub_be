import {db} from "../database";
import {PlainProgramItem} from "../models/plainProgram";
import {ExerciseItem} from "../models/exercise";
import {ProgramItem} from "../models/program";
import {WorkoutItem} from "../models/workout";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {ExerciseStatus} from "../enums/exercise-status.enum";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {PlainExerciseItem} from "../models/plainExercise";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";

export class ProgramDao {
    // region Public Methods
    static async getProgramList(userID: number): Promise<PlainProgramItem[]> {
        const res: PlainProgramItem[] = await db('User AS u')
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

    static async getProgramByProgramID(userID: number, programID: number): Promise<PlainProgramItem[]> {
        const res: PlainProgramItem[] = await db('User AS u')
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
        const res = await db('Program')
            .where({'UserID': userID, 'ProgramStateID': ProgramStateEnum.ACTIVE})
            .select();

        return res[0].ProgramID;
    }

    static async getStandardExercises(): Promise<ExerciseItem[]> {
        return db('Exercise AS e')
            .select('*');
    }

    /**
     * Restituisce il ProgramID
     * @param programItem
     */
    static async createProgram(programItem: ProgramItem): Promise<number> {
        let res: any = await db('Program').insert(programItem);
        return res[0];
    }

    /**
     * Restituisce il WorkoutID
     * @param workoutItem
     */
    static async createWorkout(workoutItem: WorkoutItem): Promise<number> {
        let res: any = await db('Workout').insert(workoutItem);
        return res[0];
    }

    /**
     * Restituisce l'ID dell'ultimo ExerciseWorkout inserito
     * @param ewItemList
     */
    static async createExerciseWorkout(ewItemList: ExerciseWorkoutItem[]): Promise<number> {
        let res: any = await db('Exercises_Workout').insert(ewItemList);
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

    static async updateExercise(exercise: UpdateExerciseDto):Promise<PlainExerciseItem> {
        await db('Exercises_Workout')
            .where({'Exercise_WorkoutID': exercise.exercise_WorkoutID})
            .update({
                set: exercise.set,
                rep: exercise.rep,
                weight: exercise.weight,
                RPE: exercise.RPE,
                RM: exercise.RM,
                percentage: exercise.percentage,
                statusID: exercise.statusID
            });

        const updatedExercise = await db('Exercises_Workout as e_w')
            .join('Exercise as e', 'e.ExerciseID', 'e_w.ExerciseID')
            .where({'Exercise_WorkoutID': exercise.exercise_WorkoutID})
            .select(['e_w.*', 'e.*'])
            .options({nestTables: true});

        return updatedExercise[0];
    }

    static async updateWorkout (workoutDto: UpdateWorkoutDto): Promise<CompleteWorkoutDto> {
        await db('Workout')
            .where({'WorkoutID': workoutDto.workoutID})
            .update({
                StatusID: ExerciseStatus.COMPLETE
            });

        const updatedWorkout = await db('Workout')
            .where({'WorkoutID': workoutDto.workoutID})
            .select();

        return updatedWorkout[0];
    }

    static async refreshProgram (programID: number): Promise<boolean> {
        await db('Workout as w')
            .join('Exercises_Workout as ew', 'w.WorkoutID', 'ew.WorkoutID')
            .where({'w.ProgramID': programID})
            .update({
                'w.StatusID': ExerciseStatus.INCOMPLETE,
                'ew.StatusID': ExerciseStatus.INCOMPLETE
            });
        return true;
    }

    static async exerciseBelongsToUser(userID: number, programID: number, workoutID: number, exercise_WorkoutID: number): Promise<boolean> {
        const userExercise: any[] = await db('Program AS p')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .join('Exercises_Workout AS ew', 'w.WorkoutID', 'ew.WorkoutID')
            .where({
                'p.ProgramStateID': ProgramStateEnum.ACTIVE,
                'p.UserID': userID,
                'w.WorkoutID': workoutID,
                'ew.Exercise_WorkoutID': exercise_WorkoutID,
                'p.ProgramID': programID
            })
            .select();

        //Se l'esercizio non era dell'utente giusto, ritorno false e non faccio l'update
        return userExercise.length >= 1;
    }

    static async workoutBelongsToUser(userID: number, programID: number, workoutID: number): Promise<boolean> {
        //verifica che l'utente possegga l'allenamento
        const userWorkout: any[] = await db('Program AS p')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .where({
                'p.ProgramStateID': ProgramStateEnum.ACTIVE,
                'p.UserID': userID,
                'w.WorkoutID': workoutID,
                'p.ProgramID': programID
            })
            .select();

        return userWorkout.length >= 1;
    }

    static async programBelongsToUser (userID: number, programID: number): Promise<boolean> {
        const userProgram: any[] = await db('Program')
            .where({
                'ProgramStateID': ProgramStateEnum.ACTIVE,
                'UserID': userID, 'ProgramID': programID
            })
            .select();

        return userProgram.length >= 1;
    }

    static async isWorkoutComplete(workoutID: number) {
        const uncompletedExercises: ExerciseWorkoutItem[] = await db('Exercises_Workout')
            .where({'WorkoutID': workoutID, 'StatusID': ExerciseStatus.INCOMPLETE});

        return uncompletedExercises.length <= 0;
    }

    static async isProgramComplete(programID: number) {
        const uncompletedWorkouts: WorkoutItem[] = await db('Workout')
            .where({'ProgramID': programID, 'StatusID': ExerciseStatus.INCOMPLETE});

        return uncompletedWorkouts.length <= 0;
    }

    //endregion
}
