import {Request, Response} from "express";
import {WeightDto} from "../dto/weightDto/weight-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightService} from "../services/weight-service";
import {PlainWeightDto} from "../dto/weightDto/plain-weight-dto";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";

export class WeightController {
    static fetchWeightHistory = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.UserJWT;
        const fetchWeightsResult: ServiceResponse<PlainWeightDto> = await WeightService.getWeights(userJWT.UserID);

        switch (fetchWeightsResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(fetchWeightsResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: fetchWeightsResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }

    static postNewWeight = async (req: Request, res: Response) => {
        const weightDto: WeightDto = req.body;
        const postNewWeightResult: ServiceResponse<any> = await WeightService.postNewWeight(weightDto);

        switch (postNewWeightResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(postNewWeightResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: postNewWeightResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }
}
