import {WorkoutItem} from "./workout";
import {ExerciseWorkoutItem} from "./exercise_workout";
import {ExerciseItem} from "./exercise";

export interface PlainWorkoutItem {
    // Workout Properties
    w: WorkoutItem,

    // Exercise_Workout Properties
    e_w: ExerciseWorkoutItem,

    // Exercise Properties
    e: ExerciseItem
}
