import {Request, Response} from "express";
import {LoginDto} from "../dto/authDto/loginDto";

export class ProgramController {
    static getProgramListByUtente = async (req: Request, res: Response) => {
        const user: LoginDto = req.body;
    }

}