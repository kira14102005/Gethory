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

