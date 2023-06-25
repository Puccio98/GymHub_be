import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {Response} from "express";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {ExerciseWorkoutService} from "../services/exercise-workout-service";
import {DeleteExerciseResponse} from "../dto/programDto/delete-exercise-response";
import {AddExerciseDto} from "../dto/programDto/add-exercise.dto";
import {DeleteExerciseWorkout} from "../interfaces/DeleteExerciseWorkout-interface";

export class ExerciseWorkoutController {
    static update = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const exercise: UpdateExerciseDto = req.body;
        const userJWT = req.AccessPayloadJWT;
        const completeExerciseResponse: ServiceResponse<ExerciseWorkoutDto> = await ExerciseWorkoutService.update(exercise, userJWT.UserID);
        switch (completeExerciseResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(completeExerciseResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: completeExerciseResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static delete = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const programID: number = Number(req.params['program_id']);
        const workoutID: number = Number(req.params['workout_id']);
        const exerciseID: number = Number(req.params['exercise_id']);

        const deleteExercise: DeleteExerciseWorkout = {
            ProgramID: programID,
            WorkoutID: workoutID,
            ExerciseID: exerciseID
        }
        const deleteExerciseResponse: ServiceResponse<DeleteExerciseResponse> = await ExerciseWorkoutService.delete(deleteExercise, userJWT.UserID);
        switch (deleteExerciseResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(deleteExerciseResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: deleteExerciseResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static create = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const exerciseDto: AddExerciseDto = req.body;

        const addWorkoutResponse: ServiceResponse<ExerciseWorkoutDto> = await ExerciseWorkoutService.create(exerciseDto, userJWT.UserID);
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
