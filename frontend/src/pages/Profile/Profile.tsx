import './Profile.module.css'
import { FollowersBox, ProfileBox, UserDescBox } from '../../components/shared/UserUI'
import Section from '../../components/shared/Section'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/authSelectors'
export function Profile() {
    const user = useSelector(selectUser)
    return <>
        <Section>
            <div className='absolute text-white z-10 w-full grid grid-cols-1 md:grid-cols-2 justify-between p-4 mt-5' >
                <ProfileBox avatar={user?.avatar ?? '/profile.png'} name={user?.name ?? 'Default_User'} username={user?.username ?? "default_user1"} followers={15} following={12} />
                <FollowersBox followers={12} following={33} />
                <UserDescBox desc='Lorem ipsum dolor sit amet consectetur, adipisicing elit. Praesentium cumque dignissimos architecto minima ea adipisci ex sequi dolorum. Consectetur, vitae.' />
            </div>
        </Section>
    </>
}