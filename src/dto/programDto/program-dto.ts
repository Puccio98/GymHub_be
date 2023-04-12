import {ProgramStateEnum} from "../../enums/program-state-enum";
import {WorkoutDto} from "./workout-dto";
import {ExerciseStatus} from "../../enums/exercise-status.enum";

export interface ProgramDto {
    programID?: number,
    userID: number,
    title: string,
    description?: string,
    programStateID: ProgramStateEnum,
    numberOfWorkout?: number
    workoutList: WorkoutDto[],
    statusID: ExerciseStatus
}

export {}
