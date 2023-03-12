import {Request, Response} from "express";
import {LoginDto} from "../dto/authDto/login-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {AuthService} from "../services/auth-service";
import {SignupDto} from "../dto/authDto/signup-dto";
import {PayloadJWT} from "../interfaces/payloadJWT";
import {AuthHelper, IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {AuthDto} from "../dto/authDto/auth-dto";

let refreshTokens: string | any[] = [];
const jwt = require('jsonwebtoken');

export class AuthController {
    static login = async (req: Request, res: Response) => {

        const loginDto: LoginDto = req.body;
        const loginUserResult: ServiceResponse<AuthDto> = await AuthService.login(loginDto);

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
        const signupResult: ServiceResponse<AuthDto> = await AuthService.signup(signupDto);

        switch (signupResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(signupResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: signupResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }
    static logout = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const payloadJWT = req.PayloadJWT;
        const logoutResult: ServiceResponse<boolean> = await AuthService.logout(payloadJWT.UserID);

        switch (logoutResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(logoutResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: logoutResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }

    static token = async (req: Request, res: Response) => {
        const refreshToken: any = req.body.refreshToken;
        if (!refreshToken) {
            res.sendStatus(403);
        }
        if (!refreshTokens.includes(refreshToken)) {
            res.sendStatus(403);
        }
        jwt.verify(refreshToken(), process.env.ACCESS_TOKEN_SECRET, (err: any, userJWT: PayloadJWT) => {
            if (err) {
                return res.sendStatus(403); // no longer valid token
            }
            const accessToken = AuthHelper.generateToken(userJWT.Email, userJWT.UserID);
            res.json({accessToken: accessToken});
        })
    }
}
