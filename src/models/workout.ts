import {ExerciseStatus} from "../enums/exercise-status.enum";

export interface WorkoutItem {
    WorkoutID?: number,
    GroupID?: number,
    ProgramID: number,
    createdAt?: Date,
    updatedAt?: Date
    StatusID?: ExerciseStatus
}


export {}
