
import { useEffect, useRef, useState } from "react";
import { DarkButton } from "../../components/shared/Buttons";
import { DarkInput } from "../../components/shared/Input";
import { Navbar } from "../../components/shared/Navigation";
import { LighttitleCard } from "../../components/shared/Card";
import './Auth.module.css'
import { user } from "../../routes/protected/ProtectedRoute";
import { Navigate } from "react-router-dom";
export function Auth() {
    const [step, setStep] = useState(0);
    let content;
    switch (step) {
        case 0:
            content = <MainCard setStep={setStep} />;
            break;
        case 1:
            content = <Step2Card setStep={setStep} />;
            break;
        case 2:
            content = <Step3Card setStep={setStep} />;
            break;
        case 3:
            content = <Step4Card setStep={setStep} limit={3000} />;
            break;
        default:
            content = <Navigate to={'/profile'} />;
            break;
    }
    return <>
        <Navbar />
        <div className="w-full h-full flex flex-row justify-center items-center">
            {content}
        </div>
    </>
}

export function MainCard({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) {

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="What Should We Call You?" />
                <DarkInput label="name" placeholder="Enter Your Name" id="u101" />
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton name="Next" onclick={() => { setStep((c: number) => c + 1) }
                    } />
                </div>
            </div>
        </div>
    </>
}


export function Step2Card({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) {

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="Okay, XYZ" subtitle="How's this photo?" />
                <div className="mt-5 flex flex-col items-center w-full">
                    <div className="w-[16vh] h-[16vh] border-[3px] border-[#4A5568] bg-[#DB9C50] rounded-full"></div>
                    <div className="mt-3 text-[#7FACCF] text-[15px]">Choose a different avatar</div>
                </div>
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton name="Next" onclick={() => { setStep((c: number) => c + 1) }
                    } />
                </div>
            </div>
        </div>
    </>
}


export function Step3Card({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) {

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="Pick a username" />
                <DarkInput label="username" placeholder="Choose a username" id="u102" />
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton name="Next" onclick={() => { setStep((c: number) => c + 1) }
                    } />
                </div>
            </div>
        </div>
    </>
}


export function Step4Card({ setStep, limit }: { setStep: React.Dispatch<React.SetStateAction<number>>, limit: number }) {
    const timer = useRef<null | number>(null)
    useEffect(() => {
        timer.current = setTimeout(() => {
            user.activated = true;
            setStep((c) => c + 1)
        }, limit)
        return () => {
            if (timer.current)
                clearTimeout(timer.current)
        }
    }, [limit])
    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center justify-between">
                <LighttitleCard title="Seting up your Gethory account" />
                <div className="flex flex-col items-center w-full">
                    <div className="w-[23vh] h-[23vh] border-r-[#D9D9D9] animate-spin border-[2vh] border-[#71E8DF] bg-transparent rounded-full"></div>
                </div>

            </div>
        </div>
    </>
}

