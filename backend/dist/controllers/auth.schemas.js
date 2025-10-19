"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verificationCodeSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const emailSchema = zod_1.default.string().email();
const passwordSchema = zod_1.default.string().min(8).max(255);
exports.loginSchema = zod_1.default.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: zod_1.default.string().optional(),
});
exports.registerSchema = exports.loginSchema.extend({
    confirmpassword: zod_1.default.string().min(8).max(255),
    name: zod_1.default.string().optional(),
}).refine((data) => {
    return data.password === data.confirmpassword;
}, { message: "Password and Confirm Password do not match" });
exports.verificationCodeSchema = zod_1.default.string().min(1).max(24);
exports.forgotPasswordSchema = zod_1.default.string().email();
exports.resetPasswordSchema = zod_1.default.object({
    password: passwordSchema,
    code: exports.verificationCodeSchema
});
