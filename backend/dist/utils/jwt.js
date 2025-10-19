"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokens = exports.signToken = exports.refereshTokenSignOptions = exports.accessTokenSignOptions = void 0;
const env_1 = require("../constants/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.accessTokenSignOptions = {};
exports.refereshTokenSignOptions = {
    audience: ['user']
};
const defaults = {
    secret: "jwt-secret",
    expiresIn: '15m',
    audience: ['user']
};
const signToken = (payload, options) => {
    const _a = options || defaults, { secret } = _a, signOptions = __rest(_a, ["secret"]);
    return jsonwebtoken_1.default.sign(payload, secret, signOptions);
};
exports.signToken = signToken;
const verifyTokens = (token, options) => {
    const _a = options || {}, { secret = env_1.JWT_SECRET } = _a, opts = __rest(_a, ["secret"]);
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret, opts);
        return { payload };
    }
    catch (err) {
        return { error: err.message };
    }
};
exports.verifyTokens = verifyTokens;
