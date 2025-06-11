import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
interface RouteProps {
    children: ReactNode
}
export const user = {
    authenticated: true,
    activated: false
};
const ProtectedRoute = (props: RouteProps) => {
    let component: ReactNode = null;
    if (!user.authenticated)
        component = <Navigate to={'/signin'} />
    else if (!user.activated)
        component = <Navigate to={'/auth'} />
    else component = props.children

    return component
}

export default ProtectedRoute   
