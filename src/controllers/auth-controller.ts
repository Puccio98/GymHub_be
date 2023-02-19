import {Request, Response} from "express";
import {UserDto} from "../dto/authDto/userDto";
import {LoginDto} from "../dto/authDto/loginDto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {AuthService} from "../services/auth-service";
import {SignupDto} from "../dto/authDto/signupDto";


const db = require("../database");


const bcrypt = require('bcryptjs');

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const loginDto: LoginDto = req.body;
        const loginUserResult: ServiceResponse<UserDto> = await AuthService.loginUser(loginDto);

        switch (loginUserResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(loginUserResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: loginUserResult.message});
            default:
                return res.json({error: "Internal server error"});
        }

    }

    static signup = async (req: Request, res: Response) => {
        const signupDto: SignupDto = req.body;
        const signupResult: ServiceResponse<UserDto> = await AuthService.signupUser(signupDto);

        switch (signupResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(signupResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: signupResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }
}