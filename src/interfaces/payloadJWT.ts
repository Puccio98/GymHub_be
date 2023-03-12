import {TokenType} from "../enums/token-type.enum";

export interface PayloadJWT {
    Email: string;
    UserID: number;
    TokenType: TokenType;
    iat?: string;
}
