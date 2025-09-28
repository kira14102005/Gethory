import type { ReactNode } from "react"
import { Navigate, redirect } from "react-router-dom"
import { user } from "./ProtectedRoute"
interface RouteProps {
    children: ReactNode
}
const SemiProtected = (props: RouteProps)  => {
      if (!user.authenticated)
        return <Navigate to={'/signin'} replace/>
    else if(!user.activated) return props.children
    else return <Navigate to={'/profile'} replace/>


}

export default SemiProtected
