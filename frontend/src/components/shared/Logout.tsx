import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LightButton } from './Buttons';
import { handleLogout } from '../../http/utils';

const LogoutButton: React.FC = () => {
    const dispatch  = useDispatch()
    const navigate = useNavigate()
    return (
        <LightButton name='Logout' onclick={async () => {
            await handleLogout(dispatch, navigate)
        }} />
    );
};

export default LogoutButton;