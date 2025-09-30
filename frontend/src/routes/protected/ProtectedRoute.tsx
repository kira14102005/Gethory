import { useEffect, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNeedsProfileSetup, selectAuthLoading, selectUser } from '../../store/authSelectors';
import AccountPendingPanel from "../../pages/Authcompletion/Authcompletion";

interface RouteProps {
    children: ReactNode
}

const ProtectedRoute = (props: RouteProps) => {
    const user= useSelector(selectUser)
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const needsSetup = useSelector(selectNeedsProfileSetup);
    const isLoading = useSelector(selectAuthLoading);
    useEffect(() => {
        console.log("Authenticatr", isAuthenticated)
        console.log("Loader", isLoading)
    },
        [])
    if (isLoading) {
        return null; // The AppInitializer handles the main loading spinner
    }

    // 2. If NOT authenticated, redirect to Signin
    if (!isAuthenticated || user === null) {
        return <Navigate to={'/signin'} replace />
    }
    if (!user.verified) { 
        return <AccountPendingPanel/>
    }

    // 3. If authenticated BUT setup incomplete, redirect to /auth
    if (needsSetup) {
        return <Navigate to={'/auth'} replace />
    }

    return props.children;
}

export default ProtectedRoute