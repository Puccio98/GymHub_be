import {ProgramStateEnum} from "../../enums/program-state-enum";
import {WorkoutGroupDto} from "./workoutGroupDto";

export interface ProgramDto {
    programID?: number,
    userID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    numberOfWorkout?: number
    workoutGroupList: WorkoutGroupDto[],
}

export {}
