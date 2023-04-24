import {UpdateWorkoutDto} from "./update-workout.dto";

export interface DeleteExerciseDto extends UpdateWorkoutDto{
  exerciseID: number;
}
