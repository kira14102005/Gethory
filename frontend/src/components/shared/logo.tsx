import { Link } from "react-router-dom"
export const Logo = () => {
    return <>
        <Link className="flex flex-row" to={'/'}>
            <img className="w-[55.3px] h-[50px]" src="/logo.png" alt="logo" /><span className="py-1 ml-2 text-[30px]">GETHORY</span>
        </Link>
    </>
}