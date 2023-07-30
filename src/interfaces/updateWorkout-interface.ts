import {StatusEnum} from "../enums/status.enum";
import {DeleteWorkout} from "./deleteWorkout-interface";

export interface UpdateWorkout extends DeleteWorkout {
    StatusID: StatusEnum
}
