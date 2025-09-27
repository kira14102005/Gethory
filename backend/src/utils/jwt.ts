import { SignOptions, verify, VerifyOptions } from "jsonwebtoken"
import { JWT_SECRET, NODE_ENV } from "../constants/env"
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"
import { HTTP } from "../constants/http"
export type refreshTokenPayload = {
    sessionId: any
}

export type accessTokenPayload = {
    sessionId: any,
    userId: mongoose.Types.ObjectId
}
type SignOptionsAndSecret = SignOptions & {
    secret: string
}
export const accessTokenSignOptions: SignOptions = {
    expiresIn: "1h",
}
export const refereshTokenSignOptions: SignOptions = {
    expiresIn: "1h",
    audience: ['user']
}
const defaults: SignOptionsAndSecret = {
    secret: "jwt-secret",
    expiresIn: '15m',
    audience: ['user']

}
export const signToken = (payload: accessTokenPayload | refreshTokenPayload, options?: SignOptionsAndSecret) => {
    const { secret, ...signOptions } = options || defaults
    return jwt.sign(payload, secret, signOptions)
}


export const verifyTokens = <TPayload>(token: string, options?: VerifyOptions & { secret: string }) => {
    const { secret = JWT_SECRET, ...opts } = options || {}
    try {
        const payload = jwt.verify(token, secret, opts) as TPayload

        return { payload }
    } catch (err: any) {
        return { error: err.message }
    }
}