import { type NavigateFunction } from 'react-router-dom';
import { api } from '.';
import { clearUser } from '../store/authSlice';
import { clearActivate } from '../store/activateSlice';
import type { AppDispatch } from '../store';

export const handleLogout = async (dispatch: AppDispatch, navigate: NavigateFunction) => {
    try {
        await api.get('/auth/logout');

        dispatch(clearUser());
        dispatch(clearActivate())

        navigate('/signin', { replace: true });
    } catch (error) {
        console.error("Logout failed, forcing state clear:", error);
        dispatch(clearUser());
        dispatch(clearActivate())
        navigate('/signin', { replace: true });
    }
};

export const getAvatarImage = (path: string) => {
    const url = path
    return url
}

export const sendVerificationCode = (data: string | null) => {
    return api.post(`/auth/email/verify?code=${data}`)
}

export const createRoom = (data: any) => {
    return api.post('/room/create', data)
}


export const getAllRooms = () => {
    return api.get('/room/fetchall');
}