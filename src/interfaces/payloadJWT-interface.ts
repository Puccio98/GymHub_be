import {TokenType} from "../enums/token-type.enum";

export interface PayloadJWT {
    Email: string;
    UserID: number;
    UserTypeID: number;
    TokenType: TokenType;
    iat?: string;
}
