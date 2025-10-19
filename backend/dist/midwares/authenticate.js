"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appAssert_1 = require("../utils/appAssert");
const http_1 = require("../constants/http");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../constants/env");
const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    (0, appAssert_1.appAssert)(accessToken, http_1.HTTP.UNAUTHORIZED, "Access Token not present");
    const { payload, error } = (0, jwt_1.verifyTokens)(accessToken, { secret: env_1.JWT_SECRET });
    (0, appAssert_1.appAssert)(payload, http_1.HTTP.UNAUTHORIZED, "Invalid accessToken");
    req.sessionId = payload.sessionId;
    req.userId = payload.userId;
    next();
};
exports.authenticate = authenticate;
