import { useState } from 'react'
import './Profile.module.css'
import { FollowersBox, ProfileBox, UserDescBox } from '../../components/shared/UserUI'
import Section from '../../components/shared/Section'
export function Profile() {
    const [name] = useState("Harshit")

    return <>
        <Section>
            <div className='absolute text-white z-10 w-full grid grid-cols-1 md:grid-cols-2 justify-between p-4'>
                <ProfileBox name={name} username='rrai21' followers={15} following={12} />
                <FollowersBox followers={12} following={33} />
                <UserDescBox desc='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium cumque dignissimos architecto minima ea adipisci ex sequi dolorum. Consectetur, vitae.' />
            </div>
        </Section>
    </>
}