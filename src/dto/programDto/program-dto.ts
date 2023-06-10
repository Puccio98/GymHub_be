import {ProgramStateEnum} from "../../enums/program-state-enum";
import {WorkoutGroupDto} from "./workoutGroupDto";
import {ProgramType} from "../../enums/program-type.enum";

export interface ProgramDto {
    programID?: number,
    programTypeID: ProgramType,
    userID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    workoutGroupList: WorkoutGroupDto[],
}

export {}
