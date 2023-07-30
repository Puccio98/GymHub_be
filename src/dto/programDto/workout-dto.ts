import {ExerciseWorkoutDto} from "./exercises_workout.dto";
import {StatusEnum} from "../../enums/status.enum";

export interface WorkoutDto {
    workoutID?: number,
    programID: number,
    exerciseList: ExerciseWorkoutDto[],
    statusID: StatusEnum
}


