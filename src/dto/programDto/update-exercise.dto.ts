import {ExerciseWorkoutDto} from "./exercises_workout.dto";

export interface UpdateExerciseDto extends ExerciseWorkoutDto {
    programID: number
}
