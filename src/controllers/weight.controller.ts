import {Response} from "express";
import {WeightDto} from "../dto/weightDto/weight.dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {WeightService} from "../services/weight-service";
import {PlainWeightDto} from "../dto/weightDto/plain-weight.dto";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";

export class WeightController {
    static fetchWeightHistory = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const userJWT = req.AccessPayloadJWT;
        const fetchWeightsResult: ServiceResponse<PlainWeightDto> = await WeightService.getWeights(userJWT.UserID);

        switch (fetchWeightsResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(fetchWeightsResult.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: fetchWeightsResult.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }

    static postNewWeight = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const weightDto: WeightDto = req.body;
        const postNewWeightResult: ServiceResponse<PlainWeightDto> = await WeightService.postNewWeight(weightDto);

        switch (postNewWeightResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.status(200).send(postNewWeightResult.data);
            case ServiceStatusEnum.ERROR:
                return res.status(400).send({error: postNewWeightResult.message});
            default:
                return res.status(500).send({error: "Internal server error"});
        }
    }
}
