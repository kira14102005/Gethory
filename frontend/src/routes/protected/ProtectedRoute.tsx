import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
interface RouteProps {
    children: ReactNode
}
const isAuth = false;
const ProtectedRoute = (props: RouteProps) => {
    if (!isAuth)
        return <Navigate to={'/signin'} />
    else return props.children

}

export default ProtectedRoute
