import {TokenTypeEnum} from "../enums/token-type.enum";

export interface PayloadJWT {
    Email: string;
    UserID: number;
    UserTypeID: number;
    TokenType: TokenTypeEnum;
    iat?: string;
}
