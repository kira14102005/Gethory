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
exports.resendEmailVerification = exports.resetPassordService = exports.sendPasswordResetEmail = exports.verifyEmail = exports.refreshUserAccessToken = exports.loginUser = exports.CreateAccount = void 0;
const env_1 = require("../constants/env");
const http_1 = require("../constants/http");
const SessionModel_1 = __importDefault(require("../models/SessionModel"));
const UserCollection_1 = __importDefault(require("../models/UserCollection"));
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
const appAssert_1 = require("../utils/appAssert");
const date_1 = require("../utils/date");
const jwt_1 = require("../utils/jwt");
const sendMail_1 = require("../utils/sendMail");
const hash_1 = require("../utils/hash");
const VerificationCodeType_1 = require("../constants/VerificationCodeType");
const CreateAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield UserCollection_1.default.exists({
        email: data.email
    });
    (0, appAssert_1.appAssert)(!existingUser, http_1.HTTP.RESOURCE_CONFLICT, "Email already exists");
    const user = yield UserCollection_1.default.create({
        email: data.email,
        password: data.password,
        avatar: env_1.DEFAULT_AVATAR
    });
    //create verification code
    const code = yield verificationCodeModel_1.default.create({
        userID: user._id,
        type: VerificationCodeType_1.VerificationCodeType.EMAIL,
        expiresAt: (0, date_1.getOneHourFromNow)()
    });
    //Send this Verification Code to the User Mail
    const verifyURL = `${env_1.APP_ORIGIN}/auth/email/verify?code=${code._id}`;
    console.log(code._id);
    const { error } = yield (0, sendMail_1.sendMail)({
        to: user.email, subject: "Verify email", text: "Check this link to verify your email",
        html: `<h2>Click this link to verify Email</h2><br/><a href=${verifyURL} target = "_blank">Click to verify</a>`
    });
    if (error)
        console.log(error);
    const sessionExpiryDate = (0, date_1.getOneHourFromNow)();
    // Session Handling
    const session = yield SessionModel_1.default.create({
        userId: user._id,
        expiresAt: sessionExpiryDate,
        userAgent: data.userAgent,
    });
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, Object.assign({ secret: env_1.JWT_SECRET, expiresIn: '1h' }, jwt_1.refereshTokenSignOptions));
    const accessToken = (0, jwt_1.signToken)({ userId: user._id, sessionId: session._id }, Object.assign({ secret: env_1.JWT_SECRET, expiresIn: env_1.ACCESS_TOKEN_EXPIRY }, jwt_1.accessTokenSignOptions));
    return { user, refreshToken, accessToken, code, refreshTokenExpiry: sessionExpiryDate };
});
exports.CreateAccount = CreateAccount;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, userAgent }) {
    const user = yield UserCollection_1.default.findOne({ email });
    (0, appAssert_1.appAssert)(user, http_1.HTTP.NOT_FOUND, "User does not Exists");
    // @ts-ignore
    const isValid = yield user.isPasswordMatch(password);
    (0, appAssert_1.appAssert)(isValid, http_1.HTTP.UNAUTHORIZED, "Wrong Password or Email");
    // const userId  = user._id
    // Check if user email is verified
    // if (!user.verified) {
    //     // Generate a new verification code
    //     const code = await VerificationModel.create({
    //         userID: user._id,
    //         type: VerificationCodeType.EMAIL,
    //         expiresAt: getOneYearFromNow()
    //     });
    //     // Send verification email
    //     const verifyURL = `${APP_ORIGIN}/auth/email/verify?code=${code._id}`;
    //     const { error } = await sendMail({
    //         to: user.email, 
    //         subject: "Verify your email to continue", 
    //         text: "Please verify your email to complete login",
    //         html: `<h2>Email Verification Required</h2>
    //                <p>Your email needs to be verified before you can login.</p>
    //                <br/>
    //                <a href=${verifyURL} target="_blank">Click here to verify your email</a>`
    //     });
    //     if (error) console.log("Error sending verification email:", error);
    //     appAssert(false, HTTP.FORBIDDEN, "Email not verified. A new verification code has been sent to your email.");
    // }
    const isFullyComplete = user.verified && user.profileCompleted;
    const isVerified = user.verified;
    let sessionExpiryDate;
    let tokenExpiryString;
    if (isFullyComplete) {
        // C. FULL SESSION (Verified + Profile Complete)
        sessionExpiryDate = (0, date_1.get30daysfromNow)();
        tokenExpiryString = "30d";
    }
    else if (isVerified) {
        // B. MEDIUM SESSION (Verified, but Profile Incomplete/Mid-Onboarding)
        sessionExpiryDate = (0, date_1.get7daysfromNow)();
        tokenExpiryString = "7d";
    }
    else {
        // A. SHORT SESSION (Unverified - Default upon new registration)
        sessionExpiryDate = (0, date_1.getOneHourFromNow)();
        tokenExpiryString = "1h";
    }
    const userId = user._id;
    const sess = yield SessionModel_1.default.create({
        userId,
        userAgent,
        expiresAt: sessionExpiryDate
    });
    const refreshToken = (0, jwt_1.signToken)({ sessionId: sess._id }, Object.assign({ secret: env_1.JWT_REFRESH_SECRET, expiresIn: tokenExpiryString }, jwt_1.refereshTokenSignOptions));
    const accessToken = (0, jwt_1.signToken)({ userId, sessionId: sess._id }, Object.assign({ secret: env_1.JWT_SECRET, expiresIn: env_1.ACCESS_TOKEN_EXPIRY }, jwt_1.accessTokenSignOptions));
    return { accessToken, refreshToken, user, refreshTokenExpiry: sessionExpiryDate };
});
exports.loginUser = loginUser;
const refreshUserAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload, error } = (0, jwt_1.verifyTokens)(refreshToken, Object.assign({ secret: env_1.JWT_REFRESH_SECRET }, jwt_1.refereshTokenSignOptions));
    (0, appAssert_1.appAssert)(payload, http_1.HTTP.UNAUTHORIZED, "Refresh Token is Invalid or malformed");
    const session = yield SessionModel_1.default.findById(payload.sessionId);
    const currTime = new Date(Date.now());
    (0, appAssert_1.appAssert)(session && currTime < session.expiresAt, http_1.HTTP.UNAUTHORIZED, "Session expired");
    // Here we checked for Whether the Session has already expired then current time or if the Session Exists
    //if session expires in 1 day then refresh this Session
    const resetSessioncondition = session.expiresAt.getTime() - Date.now() <= date_1.ONE_DAY_MILIS;
    if (resetSessioncondition) {
        session.expiresAt = (0, date_1.get30daysfromNow)();
        yield session.save();
    }
    // If we have refreshed the Session to set expiry from 30 days from now we also need to renew refreshToken
    const newRefreshToken = resetSessioncondition ? (0, jwt_1.signToken)({ sessionId: session._id }, Object.assign({ secret: env_1.JWT_REFRESH_SECRET, expiresIn: '30d' }, jwt_1.refereshTokenSignOptions)) : undefined;
    const accessToken = (0, jwt_1.signToken)({ sessionId: session._id, userId: session.userId }, Object.assign({ secret: env_1.JWT_SECRET, expiresIn: env_1.ACCESS_TOKEN_EXPIRY }, jwt_1.accessTokenSignOptions));
    return { accessToken, newRefreshToken };
});
exports.refreshUserAccessToken = refreshUserAccessToken;
const verifyEmail = (code) => __awaiter(void 0, void 0, void 0, function* () {
    //Find Corresponding code in the Verificationmodel
    const validCode = yield verificationCodeModel_1.default.findOne({
        _id: code,
        type: VerificationCodeType_1.VerificationCodeType.EMAIL,
        expiresAt: { $gt: new Date() }
    });
    //Assert Error if Not found a valid Code
    (0, appAssert_1.appAssert)(validCode, http_1.HTTP.NOT_FOUND, "Invalid or Expired Verrification_code");
    //Update the User to true 
    const updatedUser = yield UserCollection_1.default.findByIdAndUpdate(validCode.userID, {
        $set: {
            verified: true
        }
    }, { new: true });
    //Here attribute new : true to send the updated Record to the uSer or NULL
    (0, appAssert_1.appAssert)(updatedUser, http_1.HTTP.NOT_FOUND, "No Valid User found");
    yield SessionModel_1.default.deleteMany({ userId: updatedUser._id });
    yield SessionModel_1.default.deleteMany({ userId: updatedUser._id });
    // 2. Create new session with MEDIUM expiry (7 days)
    const session = yield SessionModel_1.default.create({
        userId: updatedUser._id,
        expiresAt: (0, date_1.get7daysfromNow)(),
    });
    // 3. Create new tokens with MEDIUM expiry
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, Object.assign({ secret: env_1.JWT_REFRESH_SECRET, expiresIn: "7d" }, jwt_1.refereshTokenSignOptions));
    const accessToken = (0, jwt_1.signToken)({ userId: updatedUser._id, sessionId: session._id }, Object.assign({ secret: env_1.JWT_SECRET, expiresIn: env_1.ACCESS_TOKEN_EXPIRY }, jwt_1.accessTokenSignOptions));
    return { updatedUser, accessToken, refreshToken };
});
exports.verifyEmail = verifyEmail;
const sendPasswordResetEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserCollection_1.default.findOne({ email });
    (0, appAssert_1.appAssert)(user, http_1.HTTP.NOT_FOUND, "Invalid Email ,  no record found");
    const fiveMinsAgo = (0, date_1.getFiveMinsAgo)();
    const numberOfRequestsINlast5Mins = yield verificationCodeModel_1.default.countDocuments({
        email,
        type: VerificationCodeType_1.VerificationCodeType.PASSWORD_RESET,
        createdAt: { $gt: fiveMinsAgo }
    });
    (0, appAssert_1.appAssert)(numberOfRequestsINlast5Mins <= 4, http_1.HTTP.TOO_MANY_REQUEST, "Your account has been rate limited try after 5 minutes");
    // now we need to Create a New Verification code for PASSWORD reset
    const oneHourLater = (0, date_1.getOneHourFromNow)();
    const code = yield verificationCodeModel_1.default.create({
        userID: user._id,
        expiresAt: oneHourLater,
        type: VerificationCodeType_1.VerificationCodeType.PASSWORD_RESET
    });
    console.log(code._id);
    const url = `${env_1.APP_ORIGIN}/password/reset?code=${code._id}&exp=${oneHourLater.getTime()}`;
    const { data, error } = yield (0, sendMail_1.sendMail)({ to: email, subject: `Reset Your Password ${user.name}`, text: "Here is your password reset", html: `<h2>Click this link to reset your password</h2><br/><a href=${url} target = "_blank">Click to verify</a>` });
    (0, appAssert_1.appAssert)(data === null || data === void 0 ? void 0 : data.id, http_1.HTTP.INTERNAL_SERVER_ERROR, `${error === null || error === void 0 ? void 0 : error.name} - ${error === null || error === void 0 ? void 0 : error.message}`);
    return { url, emailId: data.id };
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPassordService = (code, password) => __awaiter(void 0, void 0, void 0, function* () {
    //Check if the Code is Valid
    const verifyRecord = yield verificationCodeModel_1.default.findOne({
        _id: code,
        type: VerificationCodeType_1.VerificationCodeType.PASSWORD_RESET,
        expiresAt: { $gt: new Date() }
    });
    (0, appAssert_1.appAssert)(verifyRecord, http_1.HTTP.NOT_FOUND, "Invalid Verificaiton Code");
    const userId = verifyRecord.userID;
    const hashedPassword = yield (0, hash_1.hashValue)(password);
    const updatedUser = yield UserCollection_1.default.findByIdAndUpdate(userId, {
        $set: { password: hashedPassword }
    });
    (0, appAssert_1.appAssert)(updatedUser, http_1.HTTP.INTERNAL_SERVER_ERROR, "Failed to reset the password");
    yield SessionModel_1.default.deleteMany({ userId });
    // @ts-ignore
    return updatedUser.omitPassword();
});
exports.resetPassordService = resetPassordService;
const resendEmailVerification = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserCollection_1.default.findOne({ email });
    (0, appAssert_1.appAssert)(user, http_1.HTTP.NOT_FOUND, "User does not exist");
    (0, appAssert_1.appAssert)(!user.verified, http_1.HTTP.BAD_REQUEST, "Email is already verified");
    const fiveMinsAgo = (0, date_1.getFiveMinsAgo)();
    const numberOfRequestsInLast5Mins = yield verificationCodeModel_1.default.countDocuments({
        userID: user._id,
        type: VerificationCodeType_1.VerificationCodeType.EMAIL,
        createdAt: { $gt: fiveMinsAgo }
    });
    (0, appAssert_1.appAssert)(numberOfRequestsInLast5Mins <= 2, http_1.HTTP.TOO_MANY_REQUEST, "Too many verification requests. Please try again after 5 minutes");
    // Create new verification code
    const code = yield verificationCodeModel_1.default.create({
        userID: user._id,
        type: VerificationCodeType_1.VerificationCodeType.EMAIL,
        expiresAt: (0, date_1.getOneYearFromNow)()
    });
    console.log(code._id);
    // Send verification email
    const verifyURL = `${env_1.APP_ORIGIN}/auth/email/verify?code=${code._id}`;
    const { error } = yield (0, sendMail_1.sendMail)({
        to: user.email,
        subject: "Verify your email",
        text: "Check this link to verify your email",
        html: `<h2>Click this link to verify Email</h2><br/><a href=${verifyURL} target="_blank">Click to verify</a>`
    });
    if (error)
        console.log("Error sending verification email:", error);
    return { message: "Verification email sent successfully" };
});
exports.resendEmailVerification = resendEmailVerification;
