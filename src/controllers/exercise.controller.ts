import {Request, Response} from "express";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {ExerciseDto} from "../dto/programDto/exercise.dto";
import {ExerciseService} from "../services/exercise-service";

export class ExerciseController {
    static getList = async (req: Request, res: Response) => {
        const exerciseList: ServiceResponse<ExerciseDto[]> = await ExerciseService.getList();
        switch (exerciseList.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(exerciseList.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: exerciseList.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}
