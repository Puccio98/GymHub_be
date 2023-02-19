import {ProgramItem} from "./program";
import {WorkoutItem} from "./workout";
import {ExerciseWorkoutItem} from "./exercise_workout";
import {ExerciseItem} from "./exercise";

export interface PlainProgramItem {
    //  Program Properties
    p: ProgramItem,

    // Workout Properties
    w: WorkoutItem,

    // Exercise_Workout Properties
    e_w: ExerciseWorkoutItem,
    
    // Exercise Properties
    e: ExerciseItem
}


export {}
