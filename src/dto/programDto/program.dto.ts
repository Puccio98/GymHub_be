import {ProgramStateEnum} from "../../enums/program-state.enum";
import {WorkoutGroupDto} from "./workout-group.dto";
import {ProgramTypeEnum} from "../../enums/program-type.enum";
import {StatusEnum} from "../../enums/status.enum";

export interface ProgramDto {
    programID?: number,
    programTypeID: ProgramTypeEnum,
    userID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    statusID: StatusEnum
    workoutGroupList: WorkoutGroupDto[],
}

export {}
