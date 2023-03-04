import {Request, Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ProgramService} from "../services/program-service";
import {ProgramDto} from "../dto/programDto/program-dto";
import {ExerciseDto} from "../dto/programDto/exercise-dto";

export class ProgramController {
    static getStandardExercises = async (req: Request, res: Response) => {
        const exerciseList: ServiceResponse<ExerciseDto[]> = await ProgramService.getStandardExercises();
        switch (exerciseList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(exerciseList.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: exerciseList.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }

    static getProgramListByUserID = async (req: Request, res: Response) => {
        const userID: number = Number(req.params['user_id']);
        const programList: ServiceResponse<ProgramDto[]> = await ProgramService.getProgramListByUserID(userID);

        switch (programList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(programList.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: programList.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }
}
