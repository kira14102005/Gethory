import { DarkButton, LightButton } from "../../components/shared/Buttons"
import { Navbar } from "../../components/shared/Navigation"
import './Home.module.css'
import { Link } from "react-router-dom"

export const Home = () => {
    return <>
        <Navbar />

        <div className="w-screen h-screen flex flex-col justify-center items-center ">
            <div className="m-1 text-[#71e8df]">GETHORY CONVENE</div>
            <div className="relative w-full h-full flex flex-col items-center justify-center ">
                <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">

                </div>
                <div className="absolute inset-0 z-10 w-[80.67%] h-[75%] mx-auto flex flex-col items-center">
                    <div className="mt-3 w-[20%] text-center text-[33.3px]">
                        <span>Make Your Meetings</span>
                        <span className="text-[#DB9C50]"> Swift & Hassle-free</span>
                    </div>
                    <div className="text-center px-8 w-[80%] my-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quaerat iste quibusdam quidem ullam nisi velit. Corporis cumque temporibus sint. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia fugit deserunt tempora mollitia perferendis recusandae.
                    </div>
                    <div className="p-10 w-full flex flex-row justify-between w-[80%]">
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
