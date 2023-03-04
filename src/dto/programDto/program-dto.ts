import {ProgramStateEnum} from "../../enums/program-state-enum";
import {WorkoutDto} from "./workout-dto";

export interface ProgramDto {
    programID?: number,
    userID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    numberOfWorkout?: number
    workoutList: WorkoutDto[]
}

export {}
