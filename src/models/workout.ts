import {ExerciseStatus} from "../enums/exercise-status.enum";

export interface WorkoutItem {
    WorkoutID?: number,
    ProgramID: number,
    IsDone: boolean,
    createdAt?: Date,
    updatedAt?: Date
    StatusID?: ExerciseStatus
}


export {}
