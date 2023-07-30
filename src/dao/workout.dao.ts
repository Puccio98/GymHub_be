import {PlainWorkoutItem} from "../dto/programDto/plainWorkout.dto";
import {db} from "../database";
import {WorkoutItem} from "../models/workout";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {StatusEnum} from "../enums/status.enum";
import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {UpdateWorkout} from "../interfaces/update-workout.interface";

export class WorkoutDao {
    static async getPlain(workoutID: number): Promise<PlainWorkoutItem[]> {
        let res: PlainWorkoutItem[];
        res = await db('Workout AS w')
            .join('Exercises_Workout AS e_w', 'w.WorkoutID', 'e_w.WorkoutID')
            .join('Exercise AS e', 'e_w.ExerciseID', 'e.ExerciseID')
            .where({'w.WorkoutID': workoutID})
            .select(['w.*', 'e_w.*', 'e.*'])
            .orderBy([{column: 'e_w.Exercise_WorkoutID', order: 'asc'}])
            .options({nestTables: true});
        return res;
    }

    /**
     * Restituisce il WorkoutID
     * @param workoutItem
     */
    static async create(workoutItem: WorkoutItem): Promise<number> {
        let res: any = await db('Workout').insert(workoutItem);
        return res[0];
    }

    static async update(workout: UpdateWorkout): Promise<CompleteWorkoutDto> {
        await db('Workout')
            .where({WorkoutID: workout.WorkoutID})
            .update({
                StatusID: workout.StatusID
            });
        return WorkoutDao.get(workout.WorkoutID);
    }

    static async get(workoutID: number): Promise<CompleteWorkoutDto> {
        const workout = await db('Workout')
            .where({WorkoutID: workoutID})
            .select();
        return workout[0]
    }

    static async delete(workoutID: number): Promise<number> {
        // Elimino esercizi dell'allenamento
        await db('Exercises_Workout')
            .join('Workout AS w', 'w.WorkoutID', 'Exercises_Workout.WorkoutID')
            .where({'w.WorkoutID': workoutID})
            .delete();

        // Elimino l'allenamento
        await db('Workout')
            .where({'WorkoutID': workoutID})
            .delete();

        return workoutID;
    }

    static async belongsToUser(userID: number, programID: number, workoutID: number): Promise<boolean> {
        //verifica che l'utente possegga l'allenamento
        const userWorkout: any[] = await db('Program AS p')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .where({
                'p.UserID': userID,
                'w.WorkoutID': workoutID,
                'p.ProgramID': programID
            })
            .select();

        return userWorkout.length >= 1;
    }

    static async isComplete(workoutID: number) {
        const uncompletedExercises: ExerciseWorkoutItem[] = await db('Exercises_Workout')
            .where({WorkoutID: workoutID, StatusID: StatusEnum.INCOMPLETE});

        return uncompletedExercises.length <= 0;
    }

    static async isLast(programID: number): Promise<boolean> {
        const workouts: WorkoutItem[] = await db('Workout')
            .where({ProgramID: programID});

        return workouts.length < 2;
    }

    /**
     * ritorna il numero di allenamenti di una scheda
     * @param programID
     */
    static async programWorkoutNumber(programID: number): Promise<number> {
        const workouts: WorkoutItem[] = await db('Workout')
            .where({ProgramID: programID});

        return workouts.length;
    }
}
