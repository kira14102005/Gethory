"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendEmailVerificationController = exports.resetPasswordController = exports.sendPasswordResetEmailController = exports.verifyController = exports.refreshController = exports.logoutController = exports.loginController = exports.registerController = void 0;
const http_1 = require("../constants/http");
const auth_service_1 = require("../services/auth.service");
const catchErrorWrapper_1 = __importDefault(require("../utils/catchErrorWrapper"));
const cookie_1 = require("../utils/cookie");
const auth_schemas_1 = require("./auth.schemas");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../constants/env");
const SessionModel_1 = __importDefault(require("../models/SessionModel"));
const appAssert_1 = require("../utils/appAssert");
exports.registerController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const response = auth_schemas_1.registerSchema.parse(Object.assign(Object.assign({}, body), { userAgent: req.headers["user-agent"] }));
    // console.log(response);
    const { user, accessToken, refreshToken, code } = yield (0, auth_service_1.CreateAccount)(response);
    //Set Cookie on the Response Object
    return (0, cookie_1.setCookie)({ accessToken, refreshToken, res }).status(http_1.HTTP.OK).json({
        msg: "Registered Successfully",
        // @ts-ignore
        user: user.omitPassword()
    });
}));
exports.loginController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = auth_schemas_1.loginSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers['user-agent'] }));
    const { accessToken, refreshToken, user, refreshTokenExpiry } = yield (0, auth_service_1.loginUser)(response);
    return (0, cookie_1.setCookie)({ accessToken, refreshToken, res, refreshTokenExpiry }).status(http_1.HTTP.OK).json({
        msg: "LoggedIn Successfully",
        // @ts-ignore
        user: user.omitPassword()
    });
}));
exports.logoutController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    const { payload, error } = (0, jwt_1.verifyTokens)(accessToken, { secret: env_1.JWT_SECRET });
    if (payload) {
        const session = yield SessionModel_1.default.findByIdAndDelete(payload.sessionId);
    }
    return (0, cookie_1.clearAuthCookies)(res).json({
        msg: "Logged out from your Account Successfully"
    });
}));
exports.refreshController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['refreshToken'];
    (0, appAssert_1.appAssert)(refreshToken, http_1.HTTP.UNAUTHORIZED, "Refresh token missing");
    const { newRefreshToken, accessToken } = yield (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    if (newRefreshToken)
        res.cookie("refreshToken", newRefreshToken, (0, cookie_1.getRefreshTokenCookieOptions)());
    return res.cookie("accessToken", accessToken, (0, cookie_1.getAccessTokenCookieOptions)()).json({
        msg: "Access Token Refreshed"
    });
}));
exports.verifyController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyCode = auth_schemas_1.verificationCodeSchema.parse(req.query.code);
    const { updatedUser, accessToken, refreshToken } = yield (0, auth_service_1.verifyEmail)(verifyCode);
    (0, cookie_1.setCookie)({ res, accessToken, refreshToken });
    return res.json({
        msg: "Email Was Successfully Verified",
        // @ts-ignore
        user: updatedUser.omitPassword()
    });
}));
exports.sendPasswordResetEmailController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = auth_schemas_1.forgotPasswordSchema.parse(req.body.email);
    //Call the Service that handles password Reset emailsending
    yield (0, auth_service_1.sendPasswordResetEmail)(email);
    res.json({
        msg: "Email Sent to you for resetting your password"
    });
}));
exports.resetPasswordController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, password } = auth_schemas_1.resetPasswordSchema.parse(req.body);
    //Call service that execute 
    yield (0, auth_service_1.resetPassordService)(code, password);
    //Clear the COokies before Returning
    return (0, cookie_1.clearAuthCookies)(res).json({
        msg: "Password Reset Successful"
    });
}));
exports.resendEmailVerificationController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = auth_schemas_1.forgotPasswordSchema.parse(req.body.email);
    //Call the Service that handles resending email verification
    yield (0, auth_service_1.resendEmailVerification)(email);
    res.json({
        msg: "Verification email sent successfully"
    });
}));
