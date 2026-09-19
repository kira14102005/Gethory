import { Link } from "react-router-dom"
export const Logo = () => {
    return <>
        <Link className="flex flex-row items-center md:space-x-2 space-x-1" to={'/'}>
            <img className="md:h-[33px] h-[25px] " src="/logo.png" alt="logo" /><span className="relative top-[1px] text-md md:text-lg ">GETHORY</span>
        </Link>
    </>
}

export const DarkLogo = ()=>{
    return <>
     <Link className="flex flex-row items-center md:space-x-2 space-x-1" to={'/'}>
            <img className="md:h-[33px] h-[25px] " src="/darklogo.png" alt="logo" /><span className="relative top-[1px] text-md md:text-lg text-[#1A202C] ">GETHORY</span>
        </Link>
    </>
}