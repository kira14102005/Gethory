import { DarkLogo, Logo } from "./Logo";
import LogoutButton from "./Logout";
import { ProfileIcon } from "./UserUI";

export function Navbar() {
    return <>
        <nav className="pt-4 pl-5">
            <div>
                <Logo />
            </div>
        </nav>
    </>
}
export function NavbarWithProfile({ containLogout }: { containLogout?: boolean }) {

    return <>

        <div className="px-3 md:px-5 py-3 border-b border-[#A0AEC0] border-b-[1px]">
            <div className="flex flex-row justify-between ">
                <Logo />
                <ProfileIcon containLogout={containLogout} />

            </div>
        </div>
    </>
}
export function NavbarWithLogout() {
    return <>
        <nav className="px-4 border-b border-[#A0AEC0] pb-3 border-b-[1px] py-3">
            <div className="flex flex-row justify-between ">
                <Logo />
                <LogoutButton />

            </div>
        </nav>
    </>
}
export function LightNavbar() {
    return <>
        <nav className="pt-3 pl-4 md:pl-8">
            <div>
                <DarkLogo />
            </div>
        </nav>
    </>
}

