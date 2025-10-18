import { Link } from "react-router-dom"
export const Logo = () => {
    return <>
        <Link className="flex flex-row" to={'/'}>
            <img className="w-[36.87px] h-[33px]" src="/logo.png" alt="logo" /><span className="py-1 ml-2 text-[20px] ">GETHORY</span>
        </Link>
    </>
}

export const DarkLogo = ()=>{
    return <>
    <Link className="flex flex-row" to={'/'}>
            <img className="w-[36.87px] h-[33px]" src="/darklogo.png" alt="logo" /><span className="pt-0.5 ml-0.3 text-[20px] text-[#1A202C]">GETHORY</span>
        </Link>
    </>
}