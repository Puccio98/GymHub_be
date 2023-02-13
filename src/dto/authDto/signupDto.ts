import {LoginDto} from "./loginDto";

export interface SignupDto extends LoginDto {
    name: string;
    lastName: string;
    phoneNumber: number | null;
    country: string;
    region: string;
    city: string;
    address: string;
    cap: number | null;
}
