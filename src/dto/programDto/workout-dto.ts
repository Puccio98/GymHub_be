import {ExerciseWorkoutDto} from "./exercises_workout-dto";
import {ExerciseStatus} from "../../enums/exercise-status.enum";

export interface WorkoutDto {
    workoutID?: number,
    programID: number,
    exerciseList: ExerciseWorkoutDto[],
    statusID: ExerciseStatus
}


