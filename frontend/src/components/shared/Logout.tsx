import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../../http';
import { clearUser } from '../../store/authSlice';
import { LightButton } from './Buttons';

const LogoutButton: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');

            dispatch(clearUser());

            navigate('/signin', { replace: true });
        } catch (error) {
            console.error("Logout failed, forcing state clear:", error);
            dispatch(clearUser());
            navigate('/signin', { replace: true });
        }
    };

    return (
        <LightButton name='Logout' onclick={handleLogout} />
    );
};

export default LogoutButton;