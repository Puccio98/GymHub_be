import {ProgramStateEnum} from "../enums/program-state-enum";

export interface EditProgramItem {
    programID: number;
    programTitle: string;
    programStateID: ProgramStateEnum;
}
