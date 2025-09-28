import { HTTP } from "../constants/http";
import { CreateAccount, loginUser, refreshUserAccessToken, resetPassordService, sendPasswordResetEmail, verifyEmail, resendEmailVerification } from "../services/auth.service";
import catchError from "../utils/catchErrorWrapper";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setCookie } from "../utils/cookie";
import { loginSchema, forgotPasswordSchema, registerSchema, verificationCodeSchema, resetPasswordSchema } from "./auth.schemas";
import { accessTokenPayload, verifyTokens } from "../utils/jwt";
import { JWT_SECRET } from "../constants/env";
import SessionModel from "../models/SessionModel";
import { appAssert } from "../utils/appAssert";



export const registerController = catchError(async (req, res, next) => {
    const { body } = req
    const response = registerSchema.parse({
        ...body, userAgent: req.headers["user-agent"]
    })
    // console.log(response);
    const { user, accessToken, refreshToken, code } = await CreateAccount(response)

    //Set Cookie on the Response Object
    return setCookie({ accessToken, refreshToken, res }).status(HTTP.OK).json({
        msg: "Registered Successfully",
        // @ts-ignore
        user: user.omitPassword()
    });

})

export const loginController = catchError(async (req, res, next) => {
    const response = loginSchema.parse({ ...req.body, userAgent: req.headers['user-agent'] })
    const { accessToken, refreshToken, user } = await loginUser(response)
    //Set Cookie on the Response Object
    return setCookie({ accessToken, refreshToken, res }).status(HTTP.OK).json({
        msg: "LoggedIn Successfully",
        // @ts-ignore
        user: user.omitPassword()
    });
})


export const logoutController = catchError(async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const {payload, error} = verifyTokens<accessTokenPayload>(accessToken, { secret: JWT_SECRET })
    if (payload) {
        const session = await SessionModel.findByIdAndDelete(payload.sessionId)
    }

    return clearAuthCookies(res).json({
        msg: "Logged out from your Account Successfully"
    })
})


export const refreshController = catchError(async (req, res, next) => {
    const refreshToken = req.cookies['refreshToken'] as string | undefined
    appAssert(refreshToken, HTTP.UNAUTHORIZED, "Refresh token missing")

    const { newRefreshToken, accessToken } = await refreshUserAccessToken(refreshToken)
    if (newRefreshToken)
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
    return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
        msg: "Access Token Refreshed"
    })

})

export const verifyController = catchError(async (req, res, next) => {
    const verifyCode = verificationCodeSchema.parse(req.query.code);
    //Call a Service
    const updatedUser = await verifyEmail(verifyCode);
    return res.json({
        msg: "Email Was Successfully Verified"
    })
})



export const sendPasswordResetEmailController = catchError(async (req, res, next) => {
    const email = forgotPasswordSchema.parse(req.body.email);
    //Call the Service that handles password Reset emailsending
    await sendPasswordResetEmail(email);
    res.json({
        msg: "Email Sent to you for resetting your password"
    })

})

export const resetPasswordController = catchError(async (req, res, next) => {
    const { code, password } = resetPasswordSchema.parse(req.body);
    //Call service that execute 
    await resetPassordService(code, password);
    //Clear the COokies before Returning
    return clearAuthCookies(res).json({
        msg :  "Password Reset Successful"
    });
})

export const resendEmailVerificationController = catchError(async (req, res, next) => {
    const email = forgotPasswordSchema.parse(req.body.email);
    //Call the Service that handles resending email verification
    await resendEmailVerification(email);
    res.json({
        msg: "Verification email sent successfully"
    })
})