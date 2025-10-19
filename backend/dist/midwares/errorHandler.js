"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_1 = require("../constants/http");
const zod_1 = require("zod");
const Apperror_1 = __importDefault(require("../utils/Apperror"));
const cookie_1 = require("../utils/cookie");
const zodHandler = (res, err) => {
    const errors = err.issues.map((e) => {
        return {
            path: e.path.join('.'),
            message: e.message
        };
    });
    res.status(http_1.HTTP.BAD_REQUEST).json({
        Error: err.message,
        issues: errors
    });
};
function appErrorHandler(res, err) {
    res.status(err.statusCode).json({
        Error: err.message,
    });
}
const errorHandler = (err, req, res, next) => {
    console.log(req.path);
    if (req.path === cookie_1.REFRESH_PATH) {
        (0, cookie_1.clearAuthCookies)(res);
    }
    if (err instanceof zod_1.ZodError) {
        zodHandler(res, err);
        return;
    }
    if (err instanceof Apperror_1.default) {
        appErrorHandler(res, err);
        return;
    }
    res.status(http_1.HTTP.INTERNAL_SERVER_ERROR).json({
        Error: "Backend is down"
    });
};
exports.errorHandler = errorHandler;
