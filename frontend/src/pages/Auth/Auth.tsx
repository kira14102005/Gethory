
import { DarkButton } from "../../components/shared/Buttons";
import { DarkInput } from "../../components/shared/Input";
import { Navbar } from "../../components/shared/Navigation";
import { LighttitleCard } from "../../components/shared/TitleCard";
import './Auth.module.css'
export function Auth(){
    return <>
    <Navbar/>
    <div className="w-full h-full flex flex-row justify-center items-center">
    <MainCard />
    </div>
    </>
}

export function MainCard() {

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="What Should We Call You?" />
                <DarkInput label="name" placeholder="Enter Your Name" id="u101" />
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton  name="Next" onclick={() => { }
                    } />
                </div>
            </div>
        </div>
    </>
}