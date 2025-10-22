import { DarkButton, LightButton } from "../../components/shared/Buttons"
import { Navbar } from "../../components/shared/Navigation"
import './Home.module.css'
import { Link } from "react-router-dom"

export const Home = () => {
    return <>
        <Navbar />

        <div className="mt-6 w-screen h-screen flex flex-col justify-center items-center ">
            <div className="m-1 text-[#71e8df]">GETHORY CONVENE</div>
            <div className="relative w-full h-full flex flex-col items-center justify-center ">
                <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">

                </div>
                <div className="absolute inset-0 z-10 w-full  md:w-[80.67%] h-[75%] mx-auto flex flex-col items-center">
                    <div className="mt-3 w-[80%] md:w-[50%] lg:w-[30%] text-center text-[33.3px]">
                        <span>Make Your Meetings</span>
                        <span className="text-[#DB9C50]"> Swift & Hassle-free</span>
                    </div>
                    <div className="text-center px-8 w-[80%] my-3">
                       Stop wasting time on clunky setups. Gethory is the definitive WebRTC platform for seamless, high-definition video and audio collaboration. Connect instantly with secure, zero-download rooms. Your next great meeting is just a click away.
                    </div>
                    <div className="p-10 text-sm md:text-md flex  md:w-[80%] flex-row md:justify-between space-x-7 ">
                        <Link to={'/register'}>
                            <DarkButton name="Try Gethory Now!"
                                onclick={() => {
                                    console.log("Register Process Started")
                                }}
                            />
                        </Link>

                        <Link to={'/signin'}>
                            <LightButton name="Sign in" onclick={() => {
                                console.log("Sign in Process started")
                            }}
                            /></Link>
                    </div>
                </div>
            </div>
        </div></>
}
