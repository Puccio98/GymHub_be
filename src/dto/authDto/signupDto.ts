import {LoginDto} from "./loginDto";

export interface SignupDto extends LoginDto {
    name: string;
    lastName: string;
    phoneNumber: string | null;
    country: string;
    region: string;
    city: string;
    address: string;
    cap: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}
