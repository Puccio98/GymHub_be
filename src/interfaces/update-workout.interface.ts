import {StatusEnum} from "../enums/status.enum";
import {DeleteWorkout} from "./delete-workout.interface";

export interface UpdateWorkout extends DeleteWorkout {
    StatusID: StatusEnum
}
