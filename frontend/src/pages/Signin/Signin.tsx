import { Link, useNavigate } from "react-router-dom";
import { LoginSubmitButton, SigninButton } from "../../components/shared/Buttons";
import { SigninInput } from "../../components/shared/Input";
import { LightNavbar } from "../../components/shared/Navigation";

import './Signin.module.css'
import { TitleCard } from "../../components/shared/Card";
import { useState } from "react";

export function Signin() {
    const [userInfo, setUserinfo] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()
    function handleSignin(e: any) {
        e.preventDefault()
        console.log(userInfo)
        // setTimeout(()=>{}, 3000)
        axios.post('http://localhost:3000/auth/login', { ...userInfo }).then((res) => {
            console.log(res.data)
            navigate('/submitotp', {})

        }).catch((err) => {
            console.log(err)
        })
    }
    return <>
        <LightNavbar />
        <div className="ml-[40px] my-2 w-screen h-screen flex flex-col" >
            <TitleCard subtitle="Log in to your account to continue" title="WELCOME BACK" />
            <div className="my-3"><SigninButton name="GitHub" path="/github.png" onclick={() => { }} />
            </div>

            <SigninButton name="Google" path="/google.png" onclick={() => { }} />

            <div className="w-[80%]  flex flex-row mt-2 items-center">
                <div className="w-[44%] h-[1px] border border-black">

                </div>
                <span className="mx-1 text-[16px] text-[#A0AEC0]"> or </span>
                <div className="w-[44%] h-[1px] border border-black">

                </div>
            </div>
            <form action={handleSignin} className="flex flex-col justify-between h-[230px]">
                <SigninInput setValue={setUserinfo} label="Email" id="101" placeholder="Enter your email" value="email" />
                <SigninInput value="password" setValue={setUserinfo} label="Password" id="102" placeholder="Enter your password" />
                <LoginSubmitButton name="Login" onclick={() => { }} />
            </form>
            <div>

            </div>
            <div className="flex flex-row w-[75%] justify-center my-2 items-center">
                <span className="text-[#4A5568] text-[16px] ">Don't have an account?</span>
                <Link to={'/register'} className="text-[#4A5568] text-[16px] underline mx-1"> Sign up</Link>
            </div>
        </div>

    </>
}