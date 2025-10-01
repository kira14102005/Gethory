import axios from 'axios'
import type { ActivateState } from '../store/activateSlice';
const baseURL = import.meta.env.VITE_BACKEND_URL;
export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    withCredentials: true
})

export const sendVerificationCode = (data: string | null) => {
    return api.post(`/auth/email/verify?code=${data}`)
}

export const activate = async (currentActiveState: ActivateState) => {
    const res = await api.put('/user/update_profile', currentActiveState);
    return res
}