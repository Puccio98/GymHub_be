import {ExerciseWorkoutItem} from "../models/exercise_workout";

const Exercise_Workout = require('../models/exercise_workout');

export class BOExercise_Workout {
    // region Properties
    Exercise_WorkoutID: number;
    WorkoutID: number;
    ExerciseID: number;
    Set: number;
    Rep: number;
    Weight: number;
    RPE?: number;
    RM?: number;
    Percentage?: number;

    // endregion

    //region Constructor
    constructor(e: { exerciseWorkoutId?: number, exerciseWorkoutItem?: ExerciseWorkoutItem }) {
        if (e.exerciseWorkoutItem) {
            this.initByEntity(e.exerciseWorkoutItem)
        } else if (e.exerciseWorkoutId) {
            Exercise_Workout.findOne({where: {exerciseWorkoutID: e.exerciseWorkoutId}})
                .then((exerciseWorkoutItem: ExerciseWorkoutItem) => {
                    if (!exerciseWorkoutItem) {
                        throw  new Error('Exercise-workout not found');
                    }
                    return this.initByEntity(exerciseWorkoutItem);
                })
                .catch((err: Error) => {
                    throw  new Error(err.message);
                });
        }
        throw  new Error('Se non ho l\'ID e non ho l\'entity come pensi che io possa creare l\'esercizio?');
    }

    private initByEntity(exerciseWorkoutItem: ExerciseWorkoutItem) {
        this.Exercise_WorkoutID = exerciseWorkoutItem.ExerciseID;
        this.WorkoutID = exerciseWorkoutItem.WorkoutID;
        this.ExerciseID = exerciseWorkoutItem.ExerciseID;
        this.Set = exerciseWorkoutItem.Set;
        this.Rep = exerciseWorkoutItem.Rep;
        this.Weight = exerciseWorkoutItem.Weight;
        this.RPE = exerciseWorkoutItem.RPE;
        this.RM = exerciseWorkoutItem.RM;
        this.Percentage = exerciseWorkoutItem.Percentage;
    }

    // endregion

    //region Metodi Pubblici
    // endregion

    //region Metodi Privati
    // endregion

}
