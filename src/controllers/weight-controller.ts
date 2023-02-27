import {Request, Response} from "express";
import {WeightDto} from "../dto/weightDto/weight-dto";

const db = require("../database");

export class WeightController {
    static fetchWeightHistory = async (req: Request, res: Response) => {
        const userID: number = req.body.userID;
        console.log(userID);
    }

    static postNewWeight = async (req: Request, res: Response) => {
        const weightDto: WeightDto = req.body;
        console.log(weightDto);
    }
}
