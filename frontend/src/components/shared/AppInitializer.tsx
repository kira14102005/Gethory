
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/authSlice';
import { selectAuthLoading } from '../../store/authSelectors';
import type { AppDispatch } from '../../store/index';
import CentralLoader from './CentralLoader';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector(selectAuthLoading);

    useEffect(() => {
        
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    if (isLoading) {
        
        return <CentralLoader/>
    }

    return <>{children}</>;
};

export default AppInitializer;