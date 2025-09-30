import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env"
import { get30daysfromNow, getOneHourFromNow } from "./date"
export const REFRESH_PATH = '/auth/refresh'

type Params = {
    res: Response,
    accessToken: string,
    refreshToken: string,
    refreshTokenExpiry?: Date
}

const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure: NODE_ENV !== "development"
}

export const getAccessTokenCookieOptions = (): CookieOptions => {
    const options: CookieOptions = {
        ...defaults,
        expires: getOneHourFromNow()
    }
    return options
}

export const getRefreshTokenCookieOptions = (expiryDate?: Date): CookieOptions => {
    const defaultExpiry = get30daysfromNow();

    const options: CookieOptions = {
        ...defaults,
        expires: expiryDate || defaultExpiry,
        path: REFRESH_PATH
    }
    return options
}
export function setCookie({ res, accessToken, refreshToken, refreshTokenExpiry }: Params) {
    return res
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions(refreshTokenExpiry))
}

export const clearAuthCookies = (res: Response) => {
    return res.clearCookie('accessToken').clearCookie('refreshToken', {
        path: REFRESH_PATH
    })
}