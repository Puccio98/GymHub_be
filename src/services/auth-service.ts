import {LoginDto} from "../dto/authDto/login-dto";
import {UserDao} from "../dao/user-dao";
import {AuthLib} from "../lib_mapping/authLib";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {SignupDto} from "../dto/authDto/signup-dto";
import {AuthHelper} from "../helpers/AuthHelper";
import {AuthDto} from "../dto/authDto/auth-dto";
import {TokenDao} from "../dao/token-dao";
import {TokenDto} from "../dto/authDto/token-dto";
import {TokenItem} from "../interfaces/tokenItem-interface";
import {PayloadJWT} from "../interfaces/payloadJWT";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export class AuthService {
    static async login(loginDto: LoginDto): Promise<ServiceResponse<AuthDto>> {
        try {
            const user = await UserDao.findUserByEmail(loginDto.email);
            if (user && user.UserID) {
                if (await bcrypt.compare(loginDto.password, user.Password)) {
                    // Cancella tutti i token dell'utente
                    await TokenDao.delete(user.UserID);
                    // Genera nuova coppia di Access e Refresh token
                    const tokenDto = await AuthHelper.createTokenDto(user.Email, user.UserID);
                    const userDto = AuthLib.UserItemToUserDto(user);
                    return {
                        data: {userDto: userDto, tokenDto: tokenDto} as AuthDto,
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'User found'
                    }
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Wrong Password'
                    };
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User not found'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'DB esplode'
            };
        }
    }

    static async signup(signupDto: SignupDto): Promise<ServiceResponse<AuthDto>> {
        try {
            const userExists = await UserDao.findUserByEmail(signupDto.email);
            if (userExists) {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'User exists already!'
                }
            } else {
                signupDto.password = await bcrypt.hash(signupDto.password, 12);
                const user = await UserDao.createUser(AuthLib.SignupDtoToUserItem(signupDto));
                if (user.UserID) {
                    // Cancella tutti i token dell'utente
                    await TokenDao.delete(user.UserID);
                    // Genera nuova coppia di Access e Refresh token
                    const tokenDto = await AuthHelper.createTokenDto(user.Email, user.UserID);
                    const userDto = AuthLib.UserItemToUserDto(user);
                    return {
                        data: {userDto: userDto, tokenDto: tokenDto} as AuthDto,
                        status: ServiceStatusEnum.SUCCESS,
                        message: 'User found'
                    }
                } else {
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'User creation failed :\'c'
                    };
                }
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'DB esplode'
            };
        }
    }

    static async logout(userID: number): Promise<ServiceResponse<boolean>> {
        try {
            if (await TokenDao.delete(userID)) {
                return {
                    data: true,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'User logged out!'
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Errors :\'c'
                }
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'DB esplode'
            };
        }
    }

    static async refreshToken(userID: number, refreshToken: string): Promise<ServiceResponse<TokenDto>> {
        try {
            const dbToken: TokenItem = await TokenDao.getValidToken(userID);
            if (refreshToken !== dbToken.Token) {
                //res.sendStatus(403);
                // Refresh token non presente tra quelli validi in DB
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Refresh token non presente tra quelli validi in DB'
                }
            }
            let tokenDto: TokenDto | null = null;
            await jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, async (err: any, userJWT: PayloadJWT) => {
                if (err) {
                    //return res.sendStatus(403); // Token di refresh non più valido
                    return {
                        status: ServiceStatusEnum.ERROR,
                        message: 'Refresh token non presente tra quelli validi in DB'
                    }
                }
                tokenDto = await AuthHelper.createTokenDto(userJWT.Email, userJWT.UserID);
            });
            if (tokenDto) {
                return {
                    data: tokenDto,
                    status: ServiceStatusEnum.SUCCESS,
                    message: 'Nuova coppia di token'
                }
            } else {
                return {
                    status: ServiceStatusEnum.ERROR,
                    message: 'Non è stato possibile generare nuova coppia di token'
                };
            }
        } catch {
            return {
                status: ServiceStatusEnum.ERROR,
                message: 'DB esplode'
            };
        }
    }
}
