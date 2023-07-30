import {ProgramStateEnum} from "../../enums/program-state.enum";
import {StatusEnum} from "../../enums/status.enum";

export interface UpdateProgramDto {
    programID: number,
    programTitle: string,
    programState: ProgramStateEnum,
    statusID: StatusEnum
}
