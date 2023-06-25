import {DeleteWorkout} from "./deleteWorkout-interface";

export interface DeleteExerciseWorkout extends DeleteWorkout {
    ExerciseID: number
}