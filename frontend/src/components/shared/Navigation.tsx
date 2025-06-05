import { DarkLogo, Logo } from "./logo";
import { ProfileIcon } from "./profile";

export function Navbar() {
    return <>
        <nav>
            <div className="mt-[33.33px] ml-[40px] ">
                <Logo />
            </div>
        </nav>
    </>
}
export function NavbarWithProfile() {
    return <>
        <nav className="w-full px-[40px] border-b border-[#A0AEC0] pb-3 border-b-[1px]">
            <div className="flex flex-row w-full mt-[33.33px] justify-between ">
                <Logo />
                <ProfileIcon name="Harshit" />

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

