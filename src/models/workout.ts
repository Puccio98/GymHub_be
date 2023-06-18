import {Status} from "../enums/status.enum";

export interface WorkoutItem {
    WorkoutID?: number,
    GroupID?: number,
    ProgramID: number,
    createdAt?: Date,
    updatedAt?: Date
    StatusID?: Status
}


export {}
