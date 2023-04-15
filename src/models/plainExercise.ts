import {ExerciseWorkoutItem} from "./exercise_workout";
import {ExerciseItem} from "./exercise";

export interface PlainExerciseItem {
    // Exercise_Workout Properties
    e_w: ExerciseWorkoutItem,

    // Exercise Properties
    e: ExerciseItem
}
