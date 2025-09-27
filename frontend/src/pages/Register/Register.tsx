import { Link, useNavigate } from "react-router-dom";
import { LoginSubmitButton, SigninButton } from "../../components/shared/Buttons";
import { SigninInput } from "../../components/shared/Input";
import { LightNavbar } from "../../components/shared/Navigation";

import './Register.module.css'
import { TitleCard } from "../../components/shared/Card";
import { useState, type FormEvent } from "react";

export function Register() {
    const [userInfo, setUserinfo] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(userInfo)
        setTimeout(()=>{}, 3000)
        navigate('/submitotp', {  })
    }
    return <>
        <LightNavbar />
        <div className="ml-[40px] my-2 w-screen h-screen flex flex-col" >
            <TitleCard title="WELCOME" subtitle="Create your account here!" />
            <div className="my-3">
                <SigninButton name="GitHub" path="/github.png" onclick={() => { }} />
            </div>

            <SigninButton name="Google" path="/google.png" onclick={() => { }} />

            <div className="w-[80%]  flex flex-row mt-2 items-center">
                <div className="w-[44%] h-[1px] border border-black">

                </div>
                <span className="mx-1 text-[16px] text-[#A0AEC0]"> or </span>
                <div className="w-[44%] h-[1px] border border-black">

                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between h-[230px]">
                <SigninInput value={'email'} setValue={setUserinfo} label="Phone Number" id="101" placeholder="Enter your number" />
                <SigninInput value={'password'} setValue={setUserinfo} label="Password" id="102" placeholder="Enter your password" />
                <LoginSubmitButton name="Register" onclick={() => { }} />
            </form>
            <div>

            </div>
            <div className="flex flex-row w-[75%] justify-center my-2 items-center">
                <span className="text-[#4A5568] text-[16px] ">Already have an account?</span>
                <Link to={'/signin'} className="text-[#4A5568] text-[16px] underline mx-1"> Log in</Link>
            </div>
        </div >

    </>
}