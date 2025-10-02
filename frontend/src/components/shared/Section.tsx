import type { ReactNode } from "react"
import { MenuCard } from "./Card"
import { NavbarWithProfile } from "./Navigation"
import LogoutButton from "./Logout"

const Section = ({ children }: {
    children: ReactNode
}) => {
    return (
        <>
            <NavbarWithProfile />
            <div className='justify-between flex flex-col w-full h-fit'>
                <div className='flex  justify-between m-5 mr-10'>
                    <MenuCard title='Profile' />
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
        <>
            <NavbarWithProfile containLogout={true} />
            <div className='justify-between flex flex-col w-full h-fit'>
                <div className='relative h-fit w-full bg-[#0B1D23]/75 p-5'>
                    {children}
                </div>
            </div>
        </>)
}

export default Section
