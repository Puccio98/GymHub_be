import {Request} from "express";
import {PayloadJWT} from "../interfaces/payloadJWT-interface";
import {TokenDto} from "../dto/authDto/token.dto";
import {TokenTypeEnum} from "../enums/token-type.enum";
import {ExpirationTimeEnum} from "../enums/expiration-time.enum";
import {TokenItem} from "../interfaces/tokenItem-interface";
import {TokenDao} from "../dao/token.dao";
import {UserItem} from "../models/user";

const jwt = require('jsonwebtoken');

export interface IGetUserAuthInfoRequest extends Request {
    AccessPayloadJWT: PayloadJWT
}

export class AuthHelper {
    static async generateToken(user: UserItem | PayloadJWT, tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS): Promise<string> {
        if (!user.UserID) {
            throw new Error(`Impossibile creare il token - UserID non valido: ${user.UserID}.`);
        }
        const payloadJWT: PayloadJWT = {
            Email: user.Email,
            UserID: user.UserID,
            UserTypeID: user.UserTypeID,
            TokenType: tokenType
        };

        if (tokenType === TokenTypeEnum.ACCESS) {
            return jwt.sign(payloadJWT, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ExpirationTimeEnum.ACCESS});
        } else {
            const _refreshToken = jwt.sign(payloadJWT, process.env.REFRESH_TOKEN_SECRET, {expiresIn: ExpirationTimeEnum.REFRESH});
            const tokenItem: TokenItem = this.createTokenItemFromToken(_refreshToken, TokenTypeEnum.REFRESH);
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
            accessToken: await AuthHelper.generateToken(user, TokenTypeEnum.ACCESS),
            refreshToken: await AuthHelper.generateToken(user, TokenTypeEnum.REFRESH)
        }
    }

    static createTokenItemFromToken(token: string, tokenType: TokenTypeEnum) {
        const payload: PayloadJWT = jwt.decode(token);
        //todo trasformare in un metodo di mapping
        const expiresIn = tokenType === TokenTypeEnum.ACCESS ? ExpirationTimeEnum.ACCESS : ExpirationTimeEnum.REFRESH;
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
