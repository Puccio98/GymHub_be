import {ExerciseWorkoutDto} from "./exercises_workout-dto";

export interface WorkoutDto {
    workoutID?: number,
    programID: number,
    isDone: boolean,
    exerciseList: ExerciseWorkoutDto[],
    statusID: number
}


export {}
