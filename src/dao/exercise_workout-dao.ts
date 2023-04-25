import {db} from "../database";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {PlainExerciseItem} from "../models/plainExercise";
import {ExerciseWorkoutItem} from "../models/exercise_workout";

export class Exercise_WorkoutDao {
    static async update(exercise: UpdateExerciseDto): Promise<PlainExerciseItem> {
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

        return this.get(exercise.exercise_WorkoutID);
    }

    static async get(exercise_WorkoutID: number): Promise<PlainExerciseItem> {
        const exercise = await db('Exercises_Workout as e_w')
            .join('Exercise as e', 'e.ExerciseID', 'e_w.ExerciseID')
            .where({'Exercise_WorkoutID': exercise_WorkoutID})
            .select(['e_w.*', 'e.*'])
            .options({nestTables: true});
        return exercise[0];
    }

    /**
     * Restituisce l'ID dell'ultimo ExerciseWorkout inserito
     * @param ewItemList
     */
    static async create(ewItemList: ExerciseWorkoutItem[]): Promise<number> {
        let res: any = await db('Exercises_Workout').insert(ewItemList);
        return res[0];
    }

    static async delete(exerciseID: number): Promise<number> {
        await db('Exercises_Workout')
            .where({'Exercise_WorkoutID': exerciseID})
            .delete();

        return exerciseID;
    }

    static async belongsToUser(userID: number, programID: number, workoutID: number, exercise_WorkoutID: number): Promise<boolean> {
        const userExercise: any[] = await db('Program AS p')
            .join('Workout AS w', 'p.ProgramID', 'w.ProgramID')
            .join('Exercises_Workout AS ew', 'w.WorkoutID', 'ew.WorkoutID')
            .where({
                'p.UserID': userID,
                'w.WorkoutID': workoutID,
                'ew.Exercise_WorkoutID': exercise_WorkoutID,
                'p.ProgramID': programID
            })
            .select();

        //Se l'esercizio non era dell'utente giusto, ritorno false e non faccio l'update
        return userExercise.length >= 1;
    }

    static async isUncompleted(exerciseID: number) {
        const exerciseWorkout: ExerciseWorkoutItem[] = await db('Exercises_Workout')
            .where({'Exercise_WorkoutID': exerciseID});
        return exerciseWorkout[0].StatusID === 1;
    }

    static async isLast(workoutID: number): Promise<boolean> {
        const exercises: ExerciseWorkoutItem[] = await db('Exercises_Workout')
            .where({'WorkoutID': workoutID});

        return exercises.length < 2;
    }

}