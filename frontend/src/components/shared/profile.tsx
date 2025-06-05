import { DarkButton } from "./Buttons"

export const ProfileIcon = ({ name }: { name: string }) => {
    return <>
        <div className="flex flex-row items-center ">
            <span className="text-[20px] text-[#1A202C] text-white mr-2">
                Hello {name}
            </span>
            <div className="w-[45px] h-[45px] rounded-full bg-white flex flex-row justify-center items-center"><img className="w-[45px]" src="/profile.png" alt="profile" /></div>

        </div>
    </>
}

export interface UserInfo {
    name: string,
    username: string,
    desc?: string,
    followers: number,
    following: number,

}

export function ProfileBox(props: UserInfo) {
    return <>
        <div className="w-full md:w-[40%] p-3 flex flex-col">
            <div className="w-full flex flex-row md:justify-around justify-evenly">
                <div className="w-[20vw] h-[20vw] md:w-[10vw] md:h-[10vw]  border-[3px] border-[#4A5568] bg-[#DB9C50] rounded-full"></div>
                <div className="h-full flex flex-col justify-center ">
                    <span className="text-white text-[23px] h-[25px]">{props.name}</span>
                    <span className="text-[15px] text-[#D9D9D9] opacity-[59%]">@{props.username}</span>
                </div>
                <div className="h-full flex flex-row items-center">
                    <DarkButton name="Follow" onclick={() => { }} />
                    <svg className="text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                </div>
            </div>
        </div>
    </>
}