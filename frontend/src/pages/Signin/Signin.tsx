import { Link, useNavigate } from "react-router-dom";
import { LoginSubmitButton, SigninButton } from "../../components/shared/Buttons";
import { SigninInput } from "../../components/shared/Input";
import { LightNavbar } from "../../components/shared/Navigation";

import styles from './Signin.module.css'
import { TitleCard } from "../../components/shared/Card";
import { useState, type FormEvent, useEffect } from "react";
import { api } from "../../http";
import { Errorpopup } from "../../components/shared/Error";
import { setUser, type User } from "../../store/authSlice";
import { useDispatch } from "react-redux";

export function Signin() {
    const [userInfo, setUserinfo] = useState({
        email: "",
        password: ""
    })


    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setError(null);
                navigate('/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error, navigate]);

    function handleSignin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setError(null);
        setShowError(false);

        console.log(userInfo)

        api.post('/auth/login', { ...userInfo }).then((res) => {
            //@ts-ignore
            const data: { user: User } = res.data
            const userPayload = data.user;
            // const userPayload: User = mapUserResponseToRedux(rawUser);

            dispatch(setUser(userPayload));

            if (!userPayload.profileCompleted) {
                navigate('/auth', { replace: true });
            } else {
                navigate('/profile', { replace: true });
            }
        }).catch((err) => {
            console.log(err);

            if (err.status === 403) {
                // Email not verified - redirect to OTP page
                api.post('/auth/email/resend-verification', { email: userInfo.email }).then((res) => {
                    console.log(res.data)
                    navigate('/verify-status', {
                        state: {
                            email: userInfo.email,
                            message: "Please verify your email. A new verification code has been sent."
                        }
                    });
                }).catch((resendErr) => {
                    console.log(resendErr);
                    setError("Failed to send verification email. Please try again.");
                });
            } else {
                // Other errors - show error message
                const errorMessage = err.response?.data?.message ||
                    err.message ||
                    'Login failed. Please try again.';
                setError(errorMessage);
            }
        })
    }

    return <div className={styles.dtop}>
        <LightNavbar />

        {showError && error && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
                <Errorpopup message={error} />
            </div>
        )}
        <div className="flex flex-row justify-center pl-5 md:pl-8">
            <div className="my-2 w-screen h-screen flex flex-col" >
                <TitleCard subtitle="Log in to your account to continue" title="WELCOME BACK" />
                <div className="my-3">
                    <SigninButton name="GitHub" path="/github.png" onclick={() => { }} />
                </div>

                <SigninButton name="Google" path="/google.png" onclick={() => { }} />

                <div className="w-[80%]  flex flex-row mt-2 items-center">
                    <div className="w-[44%] h-[1px] border border-black"></div>
                    <span className="mx-1 text-[16px] text-[#A0AEC0]"> or </span>
                    <div className="w-[44%] h-[1px] border border-black"></div>
                </div>

                <form onSubmit={handleSignin} className="flex flex-col space-y-4 w-[75%]">
                    <div className="flex flex-col space-y-1"><SigninInput setValue={setUserinfo} label="Email" id="101" placeholder="Enter your email" value="email" />
                        <SigninInput value="password" setValue={setUserinfo} label="Password" id="102" placeholder="Enter your password" />
                    </div>
                    <LoginSubmitButton name="Login" onclick={() => { }} />
                </form>

                <div></div>

                <div className="flex flex-row w-[75%] justify-center my-2 items-center">
                    <span className="text-[#4A5568] text-[16px] ">Don't have an account?</span>
                    <Link to={'/register'} className="text-[#4A5568] text-[16px] underline mx-1"> Sign up</Link>
                </div>

            </div>
            <div className="hidden md:flex md:w-[38%]"></div>
        </div>
    </div>
}