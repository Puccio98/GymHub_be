import {UserDto} from "../dto/authDto/user-dto";
import {LoginDto} from "../dto/authDto/login-dto";
import {UserDao} from "../dao/user-dao";
import {AuthLib} from "../lib_mapping/authLib";
import {ServiceResponse, ServiceStatusEnum} from "../interfaces/serviceReturnType-interface";
import {SignupDto} from "../dto/authDto/signup-dto";

const bcrypt = require('bcryptjs');

export class AuthService {
    static async login(loginDto: LoginDto): Promise<ServiceResponse<UserDto>> {
        try {
            const user = await UserDao.findUserByEmail(loginDto.email);
            if (user) {
                if (await bcrypt.compare(loginDto.password, user.Password)) {
                    return {
                        data: AuthLib.UserItemToUserDto(user),
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

    static async signup(signupDto: SignupDto): Promise<ServiceResponse<UserDto>> {
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
                    return {
                        data: AuthLib.UserItemToUserDto(user),
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

}
