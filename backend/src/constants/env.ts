

const getEnv = (name: string, defValue: string) => {
    const data = process.env[name] || defValue;
    return data
}


export const DB_URI = getEnv("DB_URI", "DB_URI")
export const JWT_SECRET = getEnv("JWT_SECRET", "secret")
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET", "refresh_secret")
export const PORT = getEnv("PORT", "3000")
export const NODE_ENV = getEnv("NODE_ENV", "development")
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173")
export const RESEND_API_KEY = getEnv("RESEND_KEY", "api221")
export const EMAIL_SENDER = getEnv("EMAIL_SENDER", "sender@gmail.com")