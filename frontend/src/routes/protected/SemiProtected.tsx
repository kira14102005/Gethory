import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectNeedsProfileSetup, selectAuthLoading,  selectUser } from '../../store/authSelectors'; 
import AccountPendingPanel from "../../pages/Authcompletion/Authcompletion";

interface RouteProps {
    children: ReactNode
}

const SemiProtected = (props: RouteProps)  => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const needsSetup = useSelector(selectNeedsProfileSetup);
    const isLoading = useSelector(selectAuthLoading);
    const user  = useSelector(selectUser)
    // <AccountPendingPanel

    // 1. Wait for session check
    if (isLoading) {
        return null;
    }
    
   if (isAuthenticated) {
        // A. Profile is NOT Verified: 
        if (user && !user.verified) { 
            // Only render the warning panel on Guest pages (/signin, /register, /home)
            return <AccountPendingPanel />;
        }
        
        // B. Profile is Verified but Incomplete: Send to /auth
        if (needsSetup) {
            return <Navigate to={'/auth'} replace/>
        }
        
        // C. Fully Complete: Send to /profile
        return <Navigate to={'/profile'} replace/>
    }
    
    // 3. Scenario: Logged Out (Allow access to Signin/Register forms)
    return props.children
}

export default SemiProtected