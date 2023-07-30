import {NextFunction, Response} from "express";
import {IGetUserAuthInfoRequest} from "../helpers/auth.helper";
import {RouteNeedsToken} from "./authenticate-token.middleware";

const ApiError = require('../errors/api.error');

export function validateDtoMiddleware(schema: any) {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        try {
            if (RouteNeedsToken(req.originalUrl)) {
                req.body['userID'] = req.AccessPayloadJWT.UserID;
            }
            // Validate ritorna un nuovo oggetto che rappresenta il vecchio body validato con aggiunti i valori di default
            req.body = await schema.validate(req.body);
            next();
        } catch (err: any) {
            next(ApiError.badRequest((err as Error).message));
        }
    }
}

