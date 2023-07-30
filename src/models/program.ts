import {ProgramStateEnum} from "../enums/program-state.enum";
import {ProgramTypeEnum} from "../enums/program-type.enum";
import {StatusEnum} from "../enums/status.enum";

export interface ProgramItem {
    ProgramID?: number,
    ProgramTypeID: ProgramTypeEnum
    UserID: number,
    Title: string,
    Description?: string,
    StatusID: number,
    ProgramStateID: ProgramStateEnum,
    StatusID: StatusEnum,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
