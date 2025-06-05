import { useState } from 'react'
import './Profile.module.css'
import { NavbarWithProfile } from '../../components/shared/Navigation'
import { MenuCard } from '../../components/shared/Card'
import { FollowersBox, ProfileBox, UserDescBox } from '../../components/shared/profile'
export function Profile() {
    const [name, setName] = useState("Harshit")

    return <>
        <NavbarWithProfile />
        <div className='justify-between flex flex-col w-full h-[90%]'>
            <div className='m-5'>
                <MenuCard title='Profile' /></div>
            <div className='relative h-[80%] w-full '>
                <div className='absolute inset-0 opacity-75 z-0  h-[100%] w-full bg-[#0B1D23]'></div>
                <div className='absolute text-white z-10 w-full grid grid-cols-1 md:grid-cols-2 justify-between p-4'>
                    <ProfileBox name='Harshit Rai' username='rrai21' followers={15} following={12} />
                    <FollowersBox followers={12} following={33} />
                    <UserDescBox desc='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium cumque dignissimos architecto minima ea adipisci ex sequi dolorum. Consectetur, vitae.'/>
                </div>
            </div>
        </div>
    </>
}