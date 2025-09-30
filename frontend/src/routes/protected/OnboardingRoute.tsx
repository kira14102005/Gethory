import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNeedsProfileSetup, selectAuthLoading, selectUser } from '../../store/authSelectors';

interface RouteProps {
    children: ReactNode
}

const OnboardingRoute = (props: RouteProps) => {
    const user = useSelector(selectUser)
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const needsSetup = useSelector(selectNeedsProfileSetup);
    const isLoading = useSelector(selectAuthLoading);

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated || user === null) {
        return <Navigate to={'/signin'} replace />
    }
    if (!user.verified) {
        return <Navigate to={'/submitotp'} replace />
    }
    if (!needsSetup) {
        return <Navigate to={'/profile'} replace />
    }

    return props.children;
}

export default OnboardingRoute