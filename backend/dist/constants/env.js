"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACKEND_URL = exports.ACCESS_TOKEN_EXPIRY = exports.DEFAULT_AVATAR = exports.EMAIL_SENDER = exports.RESEND_API_KEY = exports.APP_ORIGIN = exports.NODE_ENV = exports.PORT = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = exports.DB_URI = void 0;
const getEnv = (name, defValue) => {
    var _a;
    const data = (_a = process.env[name]) !== null && _a !== void 0 ? _a : defValue;
    return data;
};
exports.DB_URI = getEnv("DB_URI", "DB_URI");
exports.JWT_SECRET = getEnv("JWT_SECRET", "secret");
exports.JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET", "refresh_secret");
exports.PORT = getEnv("PORT", "3000");
exports.NODE_ENV = getEnv("NODE_ENV", "development");
exports.APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
exports.RESEND_API_KEY = getEnv("RESEND_KEY", "api221");
exports.EMAIL_SENDER = getEnv("EMAIL_SENDER", "sender@gmail.com");
exports.DEFAULT_AVATAR = getEnv("DEFAULT_AVATAR", "...");
//@ts-ignore
exports.ACCESS_TOKEN_EXPIRY = getEnv('ACCESS_TOKEN_EXPIRY', '1m');
exports.BACKEND_URL = getEnv('BACKEND_URL', 'http://localhost:3000');
