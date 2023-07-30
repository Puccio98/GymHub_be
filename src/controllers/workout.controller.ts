import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {Response} from "express";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutService} from "../services/workout-service";
import {DeleteWorkoutResponseDto} from "../dto/programDto/delete-workout-response.dto";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";
import {UpdateWorkout} from "../interfaces/updateWorkout-interface";
import {DeleteWorkout} from "../interfaces/deleteWorkout-interface";

export class WorkoutController {
    static update = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const programID: number = Number(req.params['program_id']);
        const workoutID: number = Number(req.params['workout_id']);
        const updateDto: UpdateWorkoutDto = req.body;
        const workout: UpdateWorkout = {WorkoutID: workoutID, ProgramID: programID, StatusID: updateDto.statusID};
        const completeWorkoutResponse: ServiceResponse<CompleteWorkoutDto> = await WorkoutService.update(workout, userJWT.UserID);
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
        const programID: number = Number(req.params['program_id']);
        const workoutID: number = Number(req.params['workout_id']);
        const workout: DeleteWorkout = {WorkoutID: workoutID, ProgramID: programID};

        const deleteWorkoutResponse: ServiceResponse<DeleteWorkoutResponseDto> = await WorkoutService.delete(workout, userJWT.UserID);
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
