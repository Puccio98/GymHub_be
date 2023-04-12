import {db} from "../database";
import {PlainProgramItem} from "../models/plainProgram";
import {ExerciseItem} from "../models/exercise";
import {ProgramItem} from "../models/program";
import {WorkoutItem} from "../models/workout";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ProgramStateEnum} from "../enums/program-state-enum";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";


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
            .orderBy([{column: 'p.ProgramID', order: 'desc'},
                {column: 'w.WorkoutID', order: 'asc'},
                {column: 'e_w.Exercise_WorkoutID', order: 'asc'}])
            .options({nestTables: true});
        return res;
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
            .where('w.ProgramID', programID)
            .delete();

        // Elimino tutti gli allenamenti della scheda
        await db('Workout')
            .join('Program AS p', 'Workout.ProgramID', 'p.ProgramID')
            .where('p.ProgramID', programID)
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

    static async completeExercise(exercise: ExerciseWorkoutDto, userID: number):Promise<boolean> {
        //Verifico che l'esercizio che deve essere completato appartenga all'utente
        const userPrograms: any[] = await db('User AS u')
            .join('Program AS p', 'u.UserID', 'p.UserID')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .where({'u.UserID': userID})
            .select();

        const workoutID = userPrograms.map(w => {
            return w.WorkoutID;
        }).filter(w => {
            return w === exercise.workoutID;
        });

        //Se l'esercizio non era dell'utente giusto, ritorno false e non faccio l'update
        if(workoutID.length < 1) {
            return false;
        }

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
        return true;
    }

    static async completeWorkout (workoutID: number, userID: number): Promise<boolean> {
        //verifica che l'utente possegga l'allenamento
        const userWorkout: any[] = await db('Program AS p')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .where({'p.UserID': userID, 'w.WorkoutID': workoutID})
            .select();

        if(userWorkout.length < 1) {
            return false;
        }

        //Se il controllo passa si fa l'update dello status
        await db('Workout')
            .where({'WorkoutID': workoutID})
            .update({
                StatusID: 2
            });

        return true;
    }

    static async completeProgram (programID: number, userID: number): Promise<boolean> {
        //verifica che l'utente possegga la scheda
        const userProgram: any[] = await db('Program')
            .where({'UserID': userID, 'ProgramID': programID})
            .select();

        if(userProgram.length < 1) {
            return false;
        }

        //Se il controllo passa si fa l'update della scheda
        await db('Program')
            .where({'ProgramID': programID})
            .update({
                StatusID: 2
            })

        return true;
    }

    //endregion
}
