import {DeleteWorkout} from "./delete-workout.interface";

export interface DeleteExerciseWorkout extends DeleteWorkout {
    ExerciseID: number
}