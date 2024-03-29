import {WorkoutItem} from "../../models/workout";
import {ExerciseWorkoutItem} from "../../models/exercise_workout";
import {ExerciseItem} from "../../models/exercise";

export interface PlainWorkoutItem {
    // Workout Properties
    w: WorkoutItem,

    // Exercise_Workout Properties
    e_w: ExerciseWorkoutItem,

    // Exercise Properties
    e: ExerciseItem
}
