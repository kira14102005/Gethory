import { LighttitleCard } from "./TitleCard";

export function MainCard() {

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[75%] mx-auto flex flex-col items-center">
                <LighttitleCard title="What Should We Call You?" />
                <div className="text-center px-8 w-[80%] my-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas quaerat iste quibusdam quidem ullam nisi velit. Corporis cumque temporibus sint. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia fugit deserunt tempora mollitia perferendis recusandae.
                </div>
                <div className="p-10 w-full flex flex-row justify-between w-[80%]">

                </div>
            </div>
        </div>
    </>
}