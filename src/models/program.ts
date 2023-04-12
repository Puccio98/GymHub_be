import {ProgramStateEnum} from "../enums/program-state-enum";
import {ExerciseStatus} from "../enums/exercise-status.enum";

export interface ProgramItem {
    ProgramID?: number,
    UserID: number,
    Title: string,
    Description?: string,
    ProgramStateID: ProgramStateEnum,
    NumberOfWorkout?: number,
    createdAt?: Date,
    updatedAt?: Date,
    StatusID?: ExerciseStatus
}


export {}
