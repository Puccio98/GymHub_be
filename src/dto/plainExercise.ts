import {ExerciseWorkoutItem} from "../models/exercise_workout";
import {ExerciseItem} from "../models/exercise";

export interface PlainExerciseItem {
    // Exercise_Workout Properties
    e_w: ExerciseWorkoutItem,

    // Exercise Properties
    e: ExerciseItem
}
