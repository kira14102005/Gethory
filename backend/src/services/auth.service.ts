import { ACCESS_TOKEN_EXPIRY, APP_ORIGIN, DEFAULT_AVATAR, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
import { SignOptions } from "jsonwebtoken"; import { HTTP } from "../constants/http"
import SessionModel from "../models/SessionModel"
import User from "../models/UserCollection"
import VerificationModel from "../models/verificationCodeModel"
import { appAssert } from "../utils/appAssert"
import { get30daysfromNow, get7daysfromNow, getFiveMinsAgo, getOneHourFromNow, getOneYearFromNow, ONE_DAY_MILIS } from "../utils/date"
import { accessTokenSignOptions, refereshTokenSignOptions, refreshTokenPayload, signToken, verifyTokens } from "../utils/jwt"
import { sendMail, sendMailJet } from "../utils/sendMail"
import { hashValue } from "../utils/hash"
import { VerificationCodeType } from "../constants/VerificationCodeType";
import { renderVerificationEmail } from "../constants/mail";
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
        avatar: DEFAULT_AVATAR
    })

    //create verification code
    const code = await VerificationModel.create({
        userID: user._id,
        type: VerificationCodeType.EMAIL,
        expiresAt: getOneHourFromNow()
    })
    //Send this Verification Code to the User Mail
    console.log(code._id);
    const htm  = renderVerificationEmail(code._id , user.email)
    const respo = await sendMailJet({
        to: user.email, subject: "Verify email", text: "This is the verification code for your Gethory account",
        html: htm
    })

    // if (error) console.log(error);
    console.log(respo)
    const sessionExpiryDate = getOneHourFromNow()
    // Session Handling
    const session = await SessionModel.create({
        userId: user._id,
        expiresAt: sessionExpiryDate,
        userAgent: data.userAgent,
    });
    const refreshToken = signToken({ sessionId: session._id }, {
        secret: JWT_SECRET,
        expiresIn: '1h',
        ...refereshTokenSignOptions
    })


    const accessToken = signToken({ userId: user._id, sessionId: session._id }, {
        secret: JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        ...accessTokenSignOptions
    })

    return { user, refreshToken, accessToken, code, refreshTokenExpiry: sessionExpiryDate }
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

    let sessionExpiryDate: Date;
    let tokenExpiryString: SignOptions["expiresIn"];
    if (isFullyComplete) {
        // C. FULL SESSION (Verified + Profile Complete)
        sessionExpiryDate = get30daysfromNow();
        tokenExpiryString = "30d";
    } else if (isVerified) {
        // B. MEDIUM SESSION (Verified, but Profile Incomplete/Mid-Onboarding)
        sessionExpiryDate = get7daysfromNow();
        tokenExpiryString = "7d";
    } else {
        // A. SHORT SESSION (Unverified - Default upon new registration)
        sessionExpiryDate = getOneHourFromNow();
        tokenExpiryString = "1h";
    }

    const userId = user._id;

    const sess = await SessionModel.create({
        userId,
        userAgent,
        expiresAt: sessionExpiryDate
    })
    const refreshToken = signToken({ sessionId: sess._id }, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: tokenExpiryString,
        ...refereshTokenSignOptions
    })


    const accessToken = signToken({ userId, sessionId: sess._id }, {
        secret: JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,

        ...accessTokenSignOptions
    })


    return { accessToken, refreshToken, user, refreshTokenExpiry: sessionExpiryDate }
}


export const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload, error } = verifyTokens<refreshTokenPayload>(refreshToken, { secret: JWT_REFRESH_SECRET, ...refereshTokenSignOptions });
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
    const newRefreshToken = resetSessioncondition ? signToken({ sessionId: session._id }, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: '30d',
        ...refereshTokenSignOptions
    }) : undefined

    const accessToken = signToken({ sessionId: session._id, userId: session.userId }, {
        secret: JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        ...accessTokenSignOptions
    });

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
    await SessionModel.deleteMany({ userId: updatedUser._id });
    await SessionModel.deleteMany({ userId: updatedUser._id });

    // 2. Create new session with MEDIUM expiry (7 days)
    const session = await SessionModel.create({
        userId: updatedUser._id,
        expiresAt: get7daysfromNow(),
    });

    // 3. Create new tokens with MEDIUM expiry
    const refreshToken = signToken({ sessionId: session._id }, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: "7d",
        ...refereshTokenSignOptions
    });
    const accessToken = signToken({ userId: updatedUser._id, sessionId: session._id }, {
        secret: JWT_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRY,
        ...accessTokenSignOptions
    });

    return { updatedUser, accessToken, refreshToken };

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
    console.log(code._id)
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
    await SessionModel.deleteMany({ userId });
    // @ts-ignore
    return updatedUser.omitPassword();
}

export const resendEmailVerification = async (email: string) => {
    const user = await User.findOne({ email });
    appAssert(user, HTTP.NOT_FOUND, "User does not exist");
    appAssert(!user.verified, HTTP.BAD_REQUEST, "Email is already verified");

    const fiveMinsAgo = getFiveMinsAgo();
    const numberOfRequestsInLast5Mins = await VerificationModel.countDocuments({
        userID: user._id,
        type: VerificationCodeType.EMAIL,
        createdAt: { $gt: fiveMinsAgo }
    });
    appAssert(numberOfRequestsInLast5Mins <= 2, HTTP.TOO_MANY_REQUEST, "Too many verification requests. Please try again after 5 minutes");

    // Create new verification code
    const code = await VerificationModel.create({
        userID: user._id,
        type: VerificationCodeType.EMAIL,
        expiresAt: getOneYearFromNow()
    });
    console.log(code._id)

    // Send verification email
    const verifyURL = `${APP_ORIGIN}/auth/email/verify?code=${code._id}`;
    const { error } = await sendMail({
        to: user.email,
        subject: "Verify your email",
        text: "Check this link to verify your email",
        html: `<h2>Click this link to verify Email</h2><br/><a href=${verifyURL} target="_blank">Click to verify</a>`
    });

    if (error) console.log("Error sending verification email:", error);

    return { message: "Verification email sent successfully" };
}