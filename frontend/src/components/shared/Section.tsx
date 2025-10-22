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
            <div className='justify-between flex flex-col  h-fit'>
                <div className='flex  justify-between px-4 my-3'>
                    <MenuCard title='Profile' />
                    <LightButton name="See Rooms" onclick={() => {
                        navigate('/rooms', { replace: true })
                    }} />

                    <LogoutButton />
                </div>
                <div className='relative h-fit bg-[#0B1D23]/75 pt-5 md:pt-8'>
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
        <div className="w-full h-full">
            <NavbarWithProfile containLogout={true} />
            <div className='justify-between flex flex-col items-center h-full w-full'>
                <div className='relative h-full bg-[#0B1D23]/75  flex justify-center items-center w-full'>
                    {children}
                </div>
            </div>
        </div>)
}

export default Section
