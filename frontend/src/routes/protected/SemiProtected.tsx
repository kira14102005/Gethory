import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNeedsProfileSetup, selectAuthLoading, selectLandingPath } from '../../store/authSelectors'; 

interface RouteProps {
    children: ReactNode
}

const SemiProtected = (props: RouteProps)  => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const needsSetup = useSelector(selectNeedsProfileSetup);
    const isLoading = useSelector(selectAuthLoading);
    const landingPath = useSelector(selectLandingPath); 

    // 1. Wait for session check
    if (isLoading) {
        return null;
    }
    
    // 2. Scenario 1: User is Logged OUT (Allow Children to Render, e.g., Signin/Register)
    if (!isAuthenticated) {
        return props.children; 
    }
    
    // 3. Scenario 2: User is Logged IN
    // If user is logged in, redirect them to their primary destination.
    if (isAuthenticated) {
        return <Navigate to={landingPath} replace/>
    }

    return props.children; 
}

export default SemiProtected