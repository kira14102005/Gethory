import { RequestHandler } from "express";
import { appAssert } from "../utils/appAssert";
import { HTTP } from "../constants/http";
import { verifyTokens, accessTokenPayload } from "../utils/jwt";
import { JWT_SECRET } from "../constants/env";

export const authenticate: RequestHandler = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    appAssert(accessToken, HTTP.UNAUTHORIZED, "Access Token not present");
    const { payload, error } = verifyTokens<accessTokenPayload>(accessToken, { secret: JWT_SECRET });
    appAssert(payload, HTTP.UNAUTHORIZED, "Invalid accessToken");
    req.sessionId = payload.sessionId;
    req.userId = payload.userId;
    next();
}