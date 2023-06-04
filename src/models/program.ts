import {ProgramStateEnum} from "../enums/program-state-enum";
import {ProgramType} from "../enums/program-type.enum";

export interface ProgramItem {
    ProgramID?: number,
    ProgramTypeID: ProgramType
    UserID: number,
    Title: string,
    Description?: string,
    ProgramStateID: ProgramStateEnum,
    NumberOfWorkout?: number,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
