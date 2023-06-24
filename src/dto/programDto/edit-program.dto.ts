import {ProgramStateEnum} from "../../enums/program-state-enum";
import {Status} from "../../enums/status.enum";

export interface EditProgramDto {
    programID: number,
    programTitle: string,
    programState: ProgramStateEnum,
    statusID: Status
}
