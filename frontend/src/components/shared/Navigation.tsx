import { DarkLogo, Logo } from "./logo";

export function Navbar() {
    return <>
        <nav>
            <div className="mt-[33.33px] ml-[40px] ">
                <Logo />
            </div>
        </nav>
    </>
}
export function LightNavbar() {
    return <>
        <nav>
            <div className="mt-[33.33px] ml-[40px] ">
                <DarkLogo />
            </div>
        </nav>
    </>
}

