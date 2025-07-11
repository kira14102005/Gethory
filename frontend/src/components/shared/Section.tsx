import type { ReactNode } from "react"
import { MenuCard } from "./Card"
import { NavbarWithProfile } from "./Navigation"

const Section = ({ children }: {
    children: ReactNode
}) => {
    return (
        <>
            <NavbarWithProfile />
            <div className='justify-between flex flex-col w-full h-fit'>
                <div className='m-5'>
                    <MenuCard title='Profile' />
                </div>
                <div className='relative h-fit w-full bg-[#0B1D23]/75 p-5'>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Section
