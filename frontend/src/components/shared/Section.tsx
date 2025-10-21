import type { ReactNode } from "react"
import { MenuCard } from "./Card"
import { NavbarWithProfile } from "./Navigation"
import LogoutButton from "./Logout"
import { LightButton } from "./Buttons"
import { useNavigate } from "react-router-dom"

const Section = ({ children }: {
    children: ReactNode
}) => {
    const navigate = useNavigate()
    return (
        <>
            <NavbarWithProfile />
            <div className='justify-between flex flex-col w-full h-fit'>
                <div className='flex  justify-between m-5 mr-10'>
                    <MenuCard title='Profile' />
                    <LightButton name="See Rooms" onclick={() => {
                        navigate('/rooms', { replace: true })
                    }} />

                    <LogoutButton />
                </div>
                <div className='relative h-fit w-full bg-[#0B1D23]/75 p-5'>
                    {children}
                </div>
            </div>
        </>
    )
}

export const SectionType2 = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div className="w-screen">
            <NavbarWithProfile containLogout={true} />
            <div className='justify-between flex flex-col w-full items-center h-fit'>
                <div className='relative h-fit w-full bg-[#0B1D23]/75 p-5 flex justify-center items-center'>
                    <div className="w-[90%] ">{children}</div>
                </div>
            </div>
        </div>)
}

export default Section
