import {NextFunction, Request, Response} from "express";
import {UserJWT} from "../interfaces/userJWT";

const jwt = require('jsonwebtoken');


const protectedRoutes: string[] = [];
const unprotectedRoutes: string[] = ['auth'];

interface userGenerationToken {
    name: string;
}

export interface IGetUserAuthInfoRequest extends Request {
    UserJWT: UserJWT
}

export class AuthHelper {
    static generateToken(email: string, userID: number, refreshToken: boolean = false): string {
        const jwtPayload: UserJWT = {Email: email, UserID: userID, RefreshToken: refreshToken};
        let expiresIn: string = '1h';
        if (!refreshToken) {
            console.log(process.env.ACCESS_TOKEN_SECRET);
            return jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiresIn});
        }
        expiresIn = '1d';
        const _refreshToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiresIn});
        const payload = jwt.decode(_refreshToken);
        console.log(payload);
        //Push refresh token into DB
        //await TokenDao.create()
        return _refreshToken;
    }

    static authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
        const paths: string[] = req.path.split('/');
        if (unprotectedRoutes.includes(paths[1])) {
            next();
        } else {
            const authHeader: any = req.header('authorization');
            if (authHeader) {
                const token = authHeader.split(' ')[1]; //token
                if (!token) {
                    res.sendStatus(401); // didn't find the token
                }
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, userJWT: UserJWT) => {
                    if (err) {
                        return res.sendStatus(401); // 403 no longer valid token
                    }
                    req.UserJWT = userJWT;
                    next();
                })
            } else {
                res.sendStatus(401);
            }
        }
    }
}
