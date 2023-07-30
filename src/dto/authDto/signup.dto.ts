import {LoginDto} from "./login.dto";

export interface SignupDto extends LoginDto {
    confirmPassword: string;
    name: string;
    lastName: string;
    userName: string;
    userTypeID: number
    createdAt?: Date;
    updatedAt?: Date;
}
