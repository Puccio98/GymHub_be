import {ExerciseStatus} from "../../enums/exercise-status.enum";

export interface CompleteWorkoutDto {
    WorkoutID: number,
    ProgramID: number,
    createdAt: Date,
    updatedAt: Date,
    StatusID: ExerciseStatus
}
