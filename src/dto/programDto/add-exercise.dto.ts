import {ExerciseCreateDTO} from "./program-create-dto";

export interface AddExerciseDto {
    programID: number
    workoutID: number;
    exercise: ExerciseCreateDTO
}
