import {Request, Response} from "express";
import {LoginDto} from "../dto/authDto/login-dto";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {AuthService} from "../services/auth-service";
import {SignupDto} from "../dto/authDto/signup-dto";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";
import {AuthDto} from "../dto/authDto/auth-dto";
import {TokenDto} from "../dto/authDto/token-dto";


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
        const accessPayload = req.AccessPayloadJWT;
        const logoutResult: ServiceResponse<boolean> = await AuthService.logout(accessPayload.UserID);
        // Praticamente impossibile che entri qui
        if (!accessPayload) {
            return res.json({error: 'AccessToken not found'});
        }

        switch (logoutResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(logoutResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: logoutResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }

    static refreshToken = async (req: IGetUserAuthInfoRequest, res: Response) => {
        const refreshToken: string = req.body.refreshToken;
        const refreshTokenResult: ServiceResponse<TokenDto> = await AuthService.refreshToken(refreshToken);

        switch (refreshTokenResult.status) {
            case ServiceStatusEnum.SUCCESS:
                return res.json(refreshTokenResult.data)
            case ServiceStatusEnum.ERROR:
                return res.json({error: refreshTokenResult.message});
            default:
                return res.json({error: "Internal server error"});
        }
    }
}
