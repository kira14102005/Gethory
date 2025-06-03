import { SigninButton } from "../../components/shared/Buttons";
import { LightNavbar } from "../../components/shared/Navigation";

import './Signin.module.css'

export function Signin() {
    return <>
        <LightNavbar />
        <div className="ml-[40px] my-2 w-screen h-screen flex flex-col" >
            <div className="text-[33.3px] text-[#1A202C]">WELCOME BACK</div>
            <div className="text-[16px] text-[#4A5568]">Log in to your account to continue</div>
            <SigninButton name="GitHub" path="/github.png" onclick={() => { }} />
            <SigninButton name="Google" path="/google.png" onclick={() => { }} />
        </div>
    </>
}