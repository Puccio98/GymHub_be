import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {Response} from "express";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutService} from "../services/workout-service";
import {DeleteWorkoutResponse} from "../dto/programDto/delete-workout-response";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";

export class WorkoutController {
    static update = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const workoutDto: UpdateWorkoutDto = req.body;
        const userJWT = req.AccessPayloadJWT;
        const completeWorkoutResponse: ServiceResponse<CompleteWorkoutDto> = await WorkoutService.update(workoutDto, userJWT.UserID);
        switch (completeWorkoutResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(completeWorkoutResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: completeWorkoutResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static delete = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const workoutDto: UpdateWorkoutDto = req.body;

        const deleteWorkoutResponse: ServiceResponse<DeleteWorkoutResponse> = await WorkoutService.delete(workoutDto, userJWT.UserID);
        switch (deleteWorkoutResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(deleteWorkoutResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: deleteWorkoutResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static create = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const workoutDto: WorkoutAddDTO = req.body;

        const addWorkoutResponse: ServiceResponse<WorkoutDto> = await WorkoutService.create(workoutDto, userJWT.UserID);
        switch (addWorkoutResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(addWorkoutResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: addWorkoutResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}
