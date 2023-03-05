import {ProgramStateEnum} from "../enums/program-state-enum";

export interface ProgramItem {
    ProgramID?: number,
    UserID: number,
    Title: string,
    Description?: string,
    ProgramStateID: ProgramStateEnum,
    NumberOfWorkout?: number,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
