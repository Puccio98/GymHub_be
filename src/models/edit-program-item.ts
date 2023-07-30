import {ProgramStateEnum} from "../enums/program-state.enum";
import {StatusEnum} from "../enums/status.enum";

export interface EditProgramItem {
    ProgramID: number,
    ProgramTitle: string,
    ProgramStateID: ProgramStateEnum,
    StatusID: StatusEnum
}
