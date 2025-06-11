import type { ReactNode } from "react"
import { Navigate, redirect } from "react-router-dom"
import { user } from "./ProtectedRoute"
interface RouteProps {
    children: ReactNode
}
const SemiProtected = (props: RouteProps)  => {
      if (!user.authenticated)
        return <Navigate to={'/signin'} />
    else if(!user.activated) return props.children
    else redirect('/profile')


}

export default SemiProtected
