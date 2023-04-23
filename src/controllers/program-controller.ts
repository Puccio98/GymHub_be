import {Request, Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramService} from "../services/program-service";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ExerciseDto} from "../dto/programDto/exercise-dto";
import {ProgramCreateDTO} from "../dto/programDto/program-create-dto";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {UpdateExerciseDto} from "../dto/programDto/update-exercise.dto";
import {UpdateWorkoutDto} from "../dto/programDto/update-workout.dto";
import {ExerciseWorkoutDto} from "../dto/programDto/exercises_workout-dto";
import {CompleteWorkoutDto} from "../dto/programDto/complete-workout.dto";
import {WorkoutAddDTO} from "../dto/programDto/add-workout.dto";
import {WorkoutDto} from "../dto/programDto/workout-dto";

export class ProgramController {
    static getStandardExercises = async (req: Request, res: Response) => {
        const exerciseList: ServiceResponse<ExerciseDto[]> = await ProgramService.getStandardExercises();
        switch (exerciseList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(exerciseList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: exerciseList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static getProgramListByUserID = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.getProgramListByUserID(userJWT.UserID);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(programList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: programList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static create = async (req: Request, res: Response) => {
        const program: ProgramCreateDTO = req.body;
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.createProgram(program);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(programList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: programList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    /**
     * Metodo che effettua la cancellazione di una scheda, pulendo anche le tabelle che contengono gli allenamenti e gli esercizi per ogni allenamento.
     * La cancellazione avviene solamente se l'utente che ha richiesto l'eliminazione della scheda è anche colui che la possiede.
     * @param req
     * @param res
     */
    static delete = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const programID: number = Number(req.params['program_id']);
        const userJWT = req.AccessPayloadJWT;

        //TODO creare metodo per verificare i parametri i query params cosi come verifichiamo i DTO tramite YUP
        //TODO DEVE STARE IN UNA TRANSACTION MADONNA DI DIO SONO DUE MESI CHE DICO DI DOVERLO FARE E ANCORA NON L'HO FATTO
        const deleteResponse: ServiceResponse<boolean> = await ProgramService.delete(programID, userJWT.UserID);

        switch (deleteResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(deleteResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: deleteResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static updateExercise = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const exercise: UpdateExerciseDto = req.body;
        const userJWT = req.AccessPayloadJWT;
        const completeExerciseResponse: ServiceResponse<ExerciseWorkoutDto> = await ProgramService.updateExercise(exercise, userJWT.UserID);
        switch (completeExerciseResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(completeExerciseResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: completeExerciseResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static updateWorkout = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const workoutDto: UpdateWorkoutDto = req.body;
        const userJWT = req.AccessPayloadJWT;
        const completeWorkoutResponse: ServiceResponse<CompleteWorkoutDto> = await ProgramService.updateWorkout(workoutDto, userJWT.UserID);
        switch (completeWorkoutResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(completeWorkoutResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: completeWorkoutResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static refreshProgram = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const programID: number = req.body.programID;
        const userJWT = req.AccessPayloadJWT;
        const refreshProgramResponse: ServiceResponse<ProgramDto> = await ProgramService.refreshProgram(userJWT.UserID, programID);
        switch (refreshProgramResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(refreshProgramResponse.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: refreshProgramResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static deleteWorkout = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const workoutDto: UpdateWorkoutDto = req.body;

        const deleteWorkoutResponse: ServiceResponse<number> = await ProgramService.deleteWorkout(workoutDto, userJWT.UserID);
        switch (deleteWorkoutResponse.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(deleteWorkoutResponse.data!.toString());
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: deleteWorkoutResponse.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static addWorkout = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const workoutDto: WorkoutAddDTO = req.body;

        const addWorkoutResponse: ServiceResponse<WorkoutDto> = await ProgramService.addWorkout(workoutDto, userJWT.UserID);
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

