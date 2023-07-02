import {ProgramStateEnum} from "../enums/program-state-enum";
import {ProgramType} from "../enums/program-type.enum";
import {Status} from "../enums/status.enum";

export interface ProgramItem {
    ProgramID?: number,
    ProgramTypeID: ProgramType
    UserID: number,
    Title: string,
    Description?: string,
    ProgramStateID: ProgramStateEnum,
    StatusID: Status,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
