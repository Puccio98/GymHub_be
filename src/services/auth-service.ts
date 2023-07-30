import {LoginDto} from "../dto/authDto/login.dto";
import {UserDao} from "../dao/user.dao";
import {AuthLib} from "../lib_mapping/authLib";
import {response, ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {SignupDto} from "../dto/authDto/signup.dto";
import {AuthHelper} from "../helpers/AuthHelper";
import {AuthDto} from "../dto/authDto/auth.dto";
import {TokenDao} from "../dao/token.dao";
import {TokenDto} from "../dto/authDto/token.dto";
import {TokenItem} from "../interfaces/tokenItem-interface";
import {PayloadJWT} from "../interfaces/payloadJWT-interface";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const defaultMessage = 'Db esplode'; //messaggio di quando entra in 'catch'
let message: string; // messaggio specifico

export class AuthService {
    static async login(loginDto: LoginDto): Promise<ServiceResponse<AuthDto>> {
        try {
            const user = await UserDao.findByEmail(loginDto.email);
            if (user && user.UserID) {
                if (await bcrypt.compare(loginDto.password, user.Password)) {
                    // Cancella tutti i token dell'utente
                    await TokenDao.delete(user.UserID);
                    // Genera nuova coppia di Access e Refresh token
                    const tokenDto = await AuthHelper.createTokenDto(user);
                    const userDto = AuthLib.UserItemToUserDto(user);

                    message = 'User found';
                    const data = {userDto: userDto, tokenDto: tokenDto} as AuthDto;
                    return response(ServiceStatusEnum.SUCCESS, message, data);
                } else {
                    message = 'Wrong Password';
                    return response(ServiceStatusEnum.ERROR, message);
                }
            } else {
                message = 'User not found';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async signup(signupDto: SignupDto): Promise<ServiceResponse<AuthDto>> {
        try {
            // check Email
            let userExists = await UserDao.findByEmail(signupDto.email);
            if (userExists) {
                const message = 'User exists already!';
                return response(ServiceStatusEnum.ERROR, message);
            }
            // check Username
            userExists = await UserDao.findByUserName(signupDto.userName);
            if (userExists) {
                const message = 'Username is already taken!';
                return response(ServiceStatusEnum.ERROR, message);
            }
            // crypta password
            signupDto.password = await bcrypt.hash(signupDto.password, 12);
            const user = await UserDao.create(AuthLib.SignupDtoToUserItem(signupDto));

            if (!user.UserID) {
                message = 'User creation failed :\'c'
                return response(ServiceStatusEnum.ERROR, message);
            }

            // Cancella tutti i token dell'utente
            await TokenDao.delete(user.UserID);
            // Genera nuova coppia di Access e Refresh token
            const tokenDto = await AuthHelper.createTokenDto(user);
            const userDto = AuthLib.UserItemToUserDto(user);

            const data = {userDto: userDto, tokenDto: tokenDto} as AuthDto;
            return response(ServiceStatusEnum.SUCCESS, 'User found', data);
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async logout(userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await TokenDao.delete(userID)) {
                message = 'User logged out!';
                return response(ServiceStatusEnum.SUCCESS, message, true);
            } else {
                message = 'Errors in logout';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }

    static async refreshToken(refreshToken: string): Promise<ServiceResponse<TokenDto>> {
        try {
            const payload: PayloadJWT = jwt.decode(refreshToken);
            const dbToken: TokenItem = await TokenDao.getValidToken(payload.UserID);
            if (refreshToken !== dbToken.Token) {
                message = 'Refresh token non presente tra quelli validi in DB';
                return response(ServiceStatusEnum.ERROR, message);
            }
            let tokenDto: TokenDto | null = null;
            await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: any, userJWT: PayloadJWT) => {
                if (err) {
                    message = 'Refresh token non presente tra quelli validi in DB';
                    return response(ServiceStatusEnum.ERROR, message);
                }
                //TODO Luca: controlla questo codice
                await TokenDao.delete(userJWT.UserID);
                tokenDto = await AuthHelper.createTokenDto(userJWT);
            });
            if (tokenDto) {
                message = 'Nuova coppia di token';
                return response(ServiceStatusEnum.SUCCESS, message, tokenDto);
            } else {
                message = 'Non è stato possibile generare nuova coppia di token';
                return response(ServiceStatusEnum.ERROR, message);
            }
        } catch {
            return response(ServiceStatusEnum.ERROR, defaultMessage);
        }
    }
}
