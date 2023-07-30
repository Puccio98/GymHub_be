import {NextFunction, Request, Response} from "express";

const ApiError = require('./api.error');

function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    //console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.code).json({error: err.message});
    }

    return res.status(500).json({error: 'something went wrong'});
}

module.exports = apiErrorHandler;