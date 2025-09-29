import axios from 'axios'
const baseURL = import.meta.env.VITE_BACKEND_URL;
export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

export const sendVerificationCode = (data: string | null) => {
    return api.post(`/auth/email/verify?code=${data}`)
}