import {Status} from "../enums/status.enum";

export interface ExerciseWorkoutItem {
    Exercise_WorkoutID?: number,
    WorkoutID: number,
    ExerciseID: number,
    Description: string,
    Set: number,
    Rep: number,
    Weight: number,
    RPE?: number,
    RM?: number,
    Percentage?: number,
    createdAt?: Date,
    updatedAt?: Date,
    StatusID?: Status
}


export {}
