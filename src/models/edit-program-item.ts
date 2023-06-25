import {ProgramStateEnum} from "../enums/program-state-enum";
import {Status} from "../enums/status.enum";

export interface EditProgramItem {
    ProgramID: number,
    ProgramTitle: string,
    ProgramStateID: ProgramStateEnum,
    StatusID: Status
}
