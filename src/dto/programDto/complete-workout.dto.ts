import {StatusEnum} from "../../enums/status.enum";

export interface CompleteWorkoutDto {
    WorkoutID: number,
    ProgramID: number,
    createdAt: Date,
    updatedAt: Date,
    StatusID: StatusEnum
}
