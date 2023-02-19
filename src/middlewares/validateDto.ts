import {NextFunction, Request, Response} from "express";

const ApiError = require('../errors/api-error');

function validateDto(schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate ritorna un nuovo oggetto che rappresenta il vecchio body validato con aggiunti i valori di default
            req.body = await schema.validate(req.body);
            next();
        } catch (err: any) {
            next(ApiError.badRequest((err as Error).message));
        }

    }
}

module.exports = validateDto;