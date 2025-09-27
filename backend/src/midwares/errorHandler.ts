import { ErrorRequestHandler } from "express";
import { HTTP } from "../constants/http";
import { ZodError } from "zod";
import { Response } from "express";
import Apperror from "../utils/Apperror";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookie";
const zodHandler = (res: Response, err: ZodError) => {
    const errors = err.issues.map((e) => {
        return {
            path: e.path.join('.'),
            message: e.message
        }
    })
    res.status(HTTP.BAD_REQUEST).json({
        Error: err.message,
        issues: errors
    })
}
function appErrorHandler(res: Response, err: Apperror) {
    res.status(err.statusCode).json({
        Error: err.message,
    })
}
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(req.path)
    if(req.path === REFRESH_PATH){
        clearAuthCookies(res);
    }
    if (err instanceof ZodError) {
        zodHandler(res, err)
        return;
    }
    if (err instanceof Apperror) {
        appErrorHandler(res, err);
        return;
    }
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        Error: "Backend is down"
    })
}