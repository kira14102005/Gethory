"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.REFRESH_PATH = void 0;
exports.setCookie = setCookie;
const env_1 = require("../constants/env");
const date_1 = require("./date");
exports.REFRESH_PATH = '/auth/refresh';
const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: env_1.NODE_ENV !== "development"
};
const getAccessTokenCookieOptions = () => {
    const options = Object.assign(Object.assign({}, defaults), { expires: (0, date_1.getOneHourFromNow)() });
    return options;
};
exports.getAccessTokenCookieOptions = getAccessTokenCookieOptions;
const getRefreshTokenCookieOptions = (expiryDate) => {
    const defaultExpiry = (0, date_1.get30daysfromNow)();
    const options = Object.assign(Object.assign({}, defaults), { expires: expiryDate || defaultExpiry, path: exports.REFRESH_PATH });
    return options;
};
exports.getRefreshTokenCookieOptions = getRefreshTokenCookieOptions;
function setCookie({ res, accessToken, refreshToken, refreshTokenExpiry }) {
    return res
        .cookie("accessToken", accessToken, (0, exports.getAccessTokenCookieOptions)())
        .cookie("refreshToken", refreshToken, (0, exports.getRefreshTokenCookieOptions)(refreshTokenExpiry));
}
const clearAuthCookies = (res) => {
    return res.clearCookie('accessToken').clearCookie('refreshToken', {
        path: exports.REFRESH_PATH
    });
};
exports.clearAuthCookies = clearAuthCookies;
