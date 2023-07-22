import {Request} from "express";
import {PayloadJWT} from "../interfaces/payloadJWT-interface";
import {TokenDto} from "../dto/authDto/token-dto";
import {TokenType} from "../enums/token-type.enum";
import {ExpirationTime} from "../enums/expiration-time.enum";
import {TokenItem} from "../interfaces/tokenItem-interface";
import {TokenDao} from "../dao/token-dao";
import {UserItem} from "../models/user";

const jwt = require('jsonwebtoken');

export interface IGetUserAuthInfoRequest extends Request {
    AccessPayloadJWT: PayloadJWT
}

export class AuthHelper {
    static async generateToken(user: UserItem | PayloadJWT, tokenType: TokenType = TokenType.ACCESS): Promise<string> {
        if (!user.UserID) {
            throw new Error(`Impossibile creare il token - UserID non valido: ${user.UserID}.`);
        }
        const payloadJWT: PayloadJWT = {
            Email: user.Email,
            UserID: user.UserID,
            UserTypeID: user.UserTypeID,
            TokenType: tokenType
        };

        if (tokenType === TokenType.ACCESS) {
            return jwt.sign(payloadJWT, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ExpirationTime.ACCESS});
        } else {
            const _refreshToken = jwt.sign(payloadJWT, process.env.REFRESH_TOKEN_SECRET, {expiresIn: ExpirationTime.REFRESH});
            const tokenItem: TokenItem = this.createTokenItemFromToken(_refreshToken, TokenType.REFRESH);
            // Solo dopo aver salvato il token in DB lo restituisce
            try {
                await TokenDao.create(tokenItem);
                return _refreshToken;
            } catch (e) {
                throw(e);
            }
        }
    }

    static async createTokenDto(user: UserItem | PayloadJWT): Promise<TokenDto> {
        return {
            accessToken: await AuthHelper.generateToken(user, TokenType.ACCESS),
            refreshToken: await AuthHelper.generateToken(user, TokenType.REFRESH)
        }
    }

    static createTokenItemFromToken(token: string, tokenType: TokenType) {
        const payload: PayloadJWT = jwt.decode(token);
        //todo trasformare in un metodo di mapping
        const expiresIn = tokenType === TokenType.ACCESS ? ExpirationTime.ACCESS : ExpirationTime.REFRESH;
        return {
            UserID: payload.UserID,
            TokenTypeID: tokenType,
            Token: token,
            issuedAt: payload.iat,
            expiresIn: expiresIn,
            createdAt: new Date(),
            updatedAt: new Date()
        } as TokenItem;
    }
}
