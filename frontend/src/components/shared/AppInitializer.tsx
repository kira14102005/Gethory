
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/authSlice';
import { selectAuthLoading } from '../../store/authSelectors';
import type { AppDispatch } from '../../store/index';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isLoading = useSelector(selectAuthLoading);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    if (isLoading) {
        return <div className="h-screen w-screen flex items-center justify-center text-white">Loading Session...</div>;
    }

    return <>{children}</>;
};

export default AppInitializer;