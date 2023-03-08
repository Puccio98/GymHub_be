import {LoginDto} from "./login-dto";

export interface SignupDto extends LoginDto {
    name: string;
    lastName: string;
    phoneNumber: string | null;
    country: string;
    region: string;
    city: string;
    address: string;
    cap: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
