import type { ReactNode } from "react"
import { Route } from "react-router-dom"
interface RouteProps {
    path: string,
    children: ReactNode
}
const GuestRoute = (props: RouteProps) => {
    return (
        <Route path={props.path}>
            {props.children}
        </Route>
    )
}

export default GuestRoute
