import {ProgramStateEnum} from "../../enums/program-state-enum";
import {WorkoutGroupDto} from "./workoutGroupDto";
import {ProgramType} from "../../enums/program-type.enum";
import {Status} from "../../enums/status.enum";

export interface ProgramDto {
    programID?: number,
    programTypeID: ProgramType,
    userID: number,
    statusID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    statusID: Status
    workoutGroupList: WorkoutGroupDto[],
}

export {}
