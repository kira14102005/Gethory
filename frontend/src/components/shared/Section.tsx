import type { ReactNode } from "react"
import { MenuCard } from "./Card"
import { NavbarWithProfile } from "./Navigation"

const Section = ({ children }: {
    children: ReactNode
}) => {
    return (
        <>
            <NavbarWithProfile />
            <div className='justify-between flex flex-col w-full h-[90%]'>
                <div className='m-5'>
                    <MenuCard title='Profile' />
                </div>
                <div className='relative h-[80%] w-full '>
                    <div className='absolute inset-0 opacity-75 z-0  h-[100%] w-full bg-[#0B1D23]'></div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Section
