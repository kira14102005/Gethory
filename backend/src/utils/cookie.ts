import { CookieOptions, Response } from "express"
import { NODE_ENV } from "../constants/env"
import { get30daysfromNow, getOneHourFromNow } from "./date"


export const REFRESH_PATH = '/auth/refresh'
type Params = {
    res: Response,
    accessToken: string,
    refreshToken: string
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
export const getRefreshTokenCookieOptions = (): CookieOptions => {
    const options: CookieOptions = {
        ...defaults,
        expires: get30daysfromNow(),
        path: REFRESH_PATH
    }
    return options
}
export function setCookie({ res, accessToken, refreshToken }: Params) {
    return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())

}


export const clearAuthCookies = (res: Response) => {
    return res.clearCookie('accessToken').clearCookie('refreshToken', {
        path: REFRESH_PATH
    })
}