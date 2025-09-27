import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
import z from 'zod'
import { HTTP } from "../constants/http"
import { VerificationCodeType } from "../constants/VerificationCodeType"
import SessionModel from "../models/SessionModel"
import User from "../models/UserCollection"
import VerificationModel from "../models/verificationCodeModel"
import { appAssert } from "../utils/appAssert"
import { get30daysfromNow, getFiveMinsAgo, getOneHourFromNow, getOneYearFromNow, ONE_DAY_MILIS } from "../utils/date"
import jwt from "jsonwebtoken"
import { accessTokenPayload, accessTokenSignOptions, refereshTokenSignOptions, refreshTokenPayload, signToken, verifyTokens } from "../utils/jwt"
import { sendMail } from "../utils/sendMail"
import { resetPasswordSchema } from "../controllers/auth.schemas"
import { hashValue } from "../utils/hash"
export type CreateAccountParams = {
    email: string
    , password: string
    , userAgent?: string
}


export const CreateAccount = async (data: CreateAccountParams) => {
    const existingUser = await User.exists({
        email: data.email
    })
    appAssert(!existingUser, HTTP.RESOURCE_CONFLICT, "Email already exists");
    const user = await User.create({
        email: data.email,
        password: data.password,
    })

    //create verification code
    const code = await VerificationModel.create({
        userID: user._id,
        type: VerificationCodeType.EMAIL,
        expiresAt: getOneYearFromNow()
    })
    //Send this Verification Code to the User Mail
    const verifyURL = `${APP_ORIGIN}/email/verify?code=${code._id}`
    const { error } = await sendMail({
        to: user.email, subject: "Verify email", text: "Check this link to verify your email",
        html: `<h2>Click this link to verify Email</h2><br/><a href=${verifyURL} target = "_blank">Click to verify</a>`
    })

    if (error) console.log(error);

    // Session Handling
    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent,
    });
    const refreshToken = signToken({ sessionId: session._id }, {
        secret: JWT_SECRET,
        ...refereshTokenSignOptions
    })


    const accessToken = signToken({ userId: user._id, sessionId: session._id }, {
        secret: JWT_SECRET,
        ...accessTokenSignOptions
    })

    return { user, refreshToken, accessToken, code }
}

export type loginUserParams = {
    email: string
    , password: string
    , userAgent?: string
}



export const loginUser = async ({ email, password, userAgent }: loginUserParams) => {
    const user = await User.findOne({ email });
    appAssert(user, HTTP.NOT_FOUND, "User does not Exists")
    // @ts-ignore
    const isValid = await user.isPasswordMatch(password)
    appAssert(isValid, HTTP.UNAUTHORIZED, "Wrong Password or Email")
    const userId = user._id;

    //Create a new session fro logging IN record
    const sess = await SessionModel.create({
        userId,
        userAgent
    })
    // Create tokens
    const refreshToken = signToken({ sessionId: sess._id }, {
        secret: JWT_REFRESH_SECRET,
        ...refereshTokenSignOptions
    })


    const accessToken = signToken({ userId, sessionId: sess._id }, {
        secret: JWT_SECRET,
        ...accessTokenSignOptions
    })


    return { accessToken, refreshToken, user }
}


export const refreshUserAccessToken = async (refreshToken: string) => {
    const {payload, error} = verifyTokens<refreshTokenPayload>(refreshToken, { secret: JWT_REFRESH_SECRET, ...refereshTokenSignOptions });
    appAssert(payload, HTTP.UNAUTHORIZED, "Refresh Token is Invalid or malformed")
    const session = await SessionModel.findById(payload.sessionId)
    const currTime = new Date(Date.now());
    appAssert(session && currTime < session.expiresAt, HTTP.UNAUTHORIZED, "Session expired"
    )
    // Here we checked for Whether the Session has already expired then current time or if the Session Exists

    //if session expires in 1 day then refresh this Session

    const resetSessioncondition = session.expiresAt.getTime() - Date.now() <= ONE_DAY_MILIS
    if (resetSessioncondition) {
        session.expiresAt = get30daysfromNow();
        await session.save()
    }


    // If we have refreshed the Session to set expiry from 30 days from now we also need to renew refreshToken
    const newRefreshToken = resetSessioncondition ? signToken({ sessionId: session._id }, { secret: JWT_REFRESH_SECRET, ...refereshTokenSignOptions }) : undefined

    const accessToken = signToken({ sessionId: session._id, userId: session.userId }, { secret: JWT_SECRET, ...accessTokenSignOptions });

    return { accessToken, newRefreshToken }
}


export const verifyEmail = async (code: string) => {
    //Find Corresponding code in the Verificationmodel
    const validCode = await VerificationModel.findOne({
        _id: code,
        type: VerificationCodeType.EMAIL,
        expiresAt: { $gt: new Date() }
    })
    //Assert Error if Not found a valid Code
    appAssert(validCode, HTTP.NOT_FOUND, "Invalid or Expired Verrification_code");

    //Update the User to true 
    const updatedUser = await User.findByIdAndUpdate(validCode.userID, {
        $set: {
            verified: true
        }
    },
        { new: true });
    //Here attribute new : true to send the updated Record to the uSer or NULL
    appAssert(updatedUser, HTTP.NOT_FOUND, "No Valid User found")
    return updatedUser

}


export const sendPasswordResetEmail = async (email: string) => {
    const user = await User.findOne({ email });
    appAssert(user, HTTP.NOT_FOUND, "Invalid Email ,  no record found");
    const fiveMinsAgo = getFiveMinsAgo();
    const numberOfRequestsINlast5Mins = await VerificationModel.countDocuments({
        email,
        type: VerificationCodeType.PASSWORD_RESET,
        createdAt: { $gt: fiveMinsAgo }
    })
    appAssert(numberOfRequestsINlast5Mins <= 4, HTTP.TOO_MANY_REQUEST, "Your account has been rate limited try after 5 minutes");
    // now we need to Create a New Verification code for PASSWORD reset
    const oneHourLater = getOneHourFromNow();
    const code = await VerificationModel.create({
        userID: user._id,
        expiresAt: oneHourLater,
        type: VerificationCodeType.PASSWORD_RESET
    })
    const url = `${APP_ORIGIN}/password/reset?code=${code._id}&exp=${oneHourLater.getTime()}`
    const { data, error } = await sendMail({ to: email, subject: `Reset Your Password ${user.name}`, text: "Here is your password reset", html: `<h2>Click this link to reset your password</h2><br/><a href=${url} target = "_blank">Click to verify</a>` })
    appAssert(data?.id, HTTP.INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);
    return { url, emailId: data.id };

}

export const resetPassordService = async (code: string, password: string) => {
    //Check if the Code is Valid
    const verifyRecord = await VerificationModel.findOne({
        _id: code,
        type: VerificationCodeType.PASSWORD_RESET,
        expiresAt: { $gt: new Date() }

    });
    appAssert(verifyRecord, HTTP.NOT_FOUND, "Invalid Verificaiton Code");
    const userId = verifyRecord.userID;
    const hashedPassword = await hashValue(password);
    const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: { password: hashedPassword }
    })
    appAssert(updatedUser, HTTP.INTERNAL_SERVER_ERROR, "Failed to reset the password");
    //Now we need to delete all the Sessions of current User(Means Logout from all devices)
    await SessionModel.deleteMany({ userId });
    // @ts-ignore
    return updatedUser.omitPassword();   // Return the User After Ommitting the Password
}