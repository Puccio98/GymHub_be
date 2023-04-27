import {LoginDto} from "./login-dto";

export interface SignupDto extends LoginDto {
    confirmPassword: string;
    name: string;
    lastName: string;
    userName: string;
    createdAt?: Date;
    updatedAt?: Date;
}
