export const ProfileIcon = ({ name }: { name: string }) => {
    return <>
        <div className="flex flex-row">
            <span className="text-[20px] text-[#1A202C]">Hello {name}</span>
            <img className="w-[45.33px]" src="/profile.png" alt="profile" />

        </div>
    </>
}