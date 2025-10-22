import { Link, useNavigate } from "react-router-dom";
import { LoginSubmitButton, SigninButton } from "../../components/shared/Buttons";
import { SigninInput } from "../../components/shared/Input";
import { LightNavbar } from "../../components/shared/Navigation";

import styles from './Register.module.css'
import { TitleCard } from "../../components/shared/Card";
import { useState, type FormEvent } from "react";
import { api } from "../../http";
import { setUser, type User } from "../../store/authSlice";
import { useDispatch } from "react-redux";
export function Register() {
    const [userInfo, setUserinfo] = useState({
        email: "",
        password: ""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(userInfo)
        api.post('/auth/register', { ...userInfo, confirmpassword: userInfo.password }).then((res) => {
            console.log(res.data)
            //@ts-ignore
            const data: { user: User } = res.data
            const userPayload = data.user
            dispatch(setUser(userPayload))
            navigate('/submitotp', { replace: true })

        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div className={styles.dtop}>
            <LightNavbar />
            <div className="flex flex-row justify-center pl-5">
                <div className="flex flex-col md:w-[60%] w-full" >
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
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-[75%]">
                        <div className="flex flex-col space-y-1">
                            <SigninInput value={'email'} setValue={setUserinfo} label="Email" id="101" placeholder="Enter your email" />
                            <SigninInput value={'password'} setValue={setUserinfo} label="Password" id="102" placeholder="Enter your password" />
                        </div>
                        <LoginSubmitButton name="Register" onclick={() => { }} />
                    </form>
                    <div>

                    </div>
                    <div className="flex flex-row w-[75%] justify-center my-2 items-center">
                        <span className="text-[#4A5568] text-[16px] ">Already have an account?</span>
                        <Link to={'/signin'} className="text-[#4A5568] text-[16px] underline mx-1"> Log in</Link>
                    </div>
                </div >
                <div className="hidden md:flex md:w-[38%]"></div>
            </div>
        </div>)
}