import {ProgramStateEnum} from "../../enums/program-state-enum";

export interface EditProgramDto {
    programID: number;
    programTitle: string;
    programState: ProgramStateEnum;
}
