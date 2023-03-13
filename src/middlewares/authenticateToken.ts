import {NextFunction, Response} from "express";
import {PayloadJWT} from "../interfaces/payloadJWT";
import {IGetUserAuthInfoRequest} from "../helpers/AuthHelper";

const jwt = require('jsonwebtoken');

const protectedRoutes: string[] = ['/auth/logout'];// '/auth/refresh'
const unprotectedRoutes: string[] = ['auth'];

function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const paths: string[] = req.path.split('/');
    // Salta la verifica del token solamente se l'url completo non si trova nelle rotte protette e l'url di base è presente tra quelle non protette.
    if (!protectedRoutes.includes(req.path) && unprotectedRoutes.includes(paths[1])) {
        next();
    } else {
        const authHeader: any = req.header('authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1]; //token
            if (!token) {
                res.sendStatus(401); // didn't find the token --> qui va fatto il logout nel FE
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, userJWT: PayloadJWT) => {
                if (err) {
                    return res.sendStatus(403); // Qui provo con 403 --> va mandata la refresh
                }
                req.AccessPayloadJWT = userJWT;
                next();
            })
        } else {
            res.sendStatus(401);
        }
    }
}


module.exports = authenticateToken;
