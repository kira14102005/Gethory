import { Link } from "react-router-dom";

export function Navbar() {
    return <>
        <nav>
            <div className="mt-[51px] ml-[61px] ">
                <Link className="flex flex-row" to={'/'}>
                    <img className="w-[55.3px] h-[50px]" src="/logo.png" alt="logo" /><span className="py-1 ml-2 text-[30px]">GETHORY</span>
                </Link>
            </div>
            

        </nav>    
        </>
}