import {ExerciseDto} from "./exercise-dto";

export interface ExerciseWorkoutDto extends ExerciseDto {
    exercise_WorkoutID?: number,
    workoutID: number,
    description: string,
    set: number,
    rep: number,
    weight: number,
    RPE?: number,
    RM?: number,
    percentage?: number,
    statusID: number
}


export {}
