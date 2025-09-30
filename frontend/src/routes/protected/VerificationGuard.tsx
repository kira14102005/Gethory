import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, selectUser } from '../../store/authSelectors'; 

interface RouteProps {
    children: ReactNode
}

const VerificationGuard = (props: RouteProps) => {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);

    if (isLoading) {
        return null;
    }

    // 1. Not Authenticated: Must Sign in
    if (!isAuthenticated || user === null) {
        return <Navigate to={'/signin'} replace />
    }

    // 2. ALREADY Verified: Access is no longer needed here.
    if (user.verified) { 
        if (!user.profileCompleted) {
             return <Navigate to={'/auth'} replace />
        } else {
             return <Navigate to={'/profile'} replace />
        }
    }

    return props.children;
}

export default VerificationGuard;