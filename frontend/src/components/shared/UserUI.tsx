import { useSelector } from "react-redux";
import { DarkButton } from "./Buttons"
import { CustomBox } from "./Card";
import { selectUser } from "../../store/authSelectors";

import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from "react-redux";
import { handleLogout } from "../../http/utils";
export const ProfileIcon = ({ containLogout, }: { containLogout?: boolean }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const avatar = useSelector(selectUser)?.avatar ?? ''
    const name = useSelector(selectUser)?.name ?? ''
    return <>
        <div className="flex flex-row items-center ">
            <span className="text-[20px] text-[#1A202C] text-white mr-2">
                Hello {name}
            </span>
            <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center overflow-hidden justify-center items-center">
                <Link to='/profile'><img className="w-[90%] h-[90%] object-cover" src={avatar} alt="profile" />
                </Link>
            </div>
            {containLogout && <button className="ml-2 p-2 rounded-full hover:border-white
            border border-transparent aspect-square flex items-center justify-center" onClick={async () => {
                    await handleLogout(dispatch, navigate)
                }}>
                <LogoutIcon fontSize="small" />
            </button>}

        </div>
    </>
}

export interface UserInfo {
    name: string,
    username: string,
    desc?: string,
    followers: number,
    following: number,
    avatar: string

}

export function ProfileBox(props: UserInfo) {
    return <>
        <div className="w-full flex flex-col">
            <div className="w-full flex flex-row md:justify-around justify-evenly">
                <div className="w-[20vw] h-[20vw] md:w-[10vw] md:h-[10vw]  border-[3px] border-[#4A5568] bg-[#DB9C50] rounded-full flex items-center justify-center ">
                    <div className="w-[90%] h-[90%] overflow-hidden rounded-full"> <img src={props.avatar} alt="" className="cover" />
                    </div>
                </div>
                <div className="h-full flex flex-col justify-center ">
                    <span className="text-white text-[23px] h-[25px]">{props.name}</span>
                    <span className="text-[15px] text-[#D9D9D9] opacity-[59%]">@{props.username}</span>
                </div>
                <div className="h-full flex flex-row items-center">
                    <DarkButton name="Follow" onclick={() => { }} />
                    <svg className="text-white" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                </div>
            </div>
        </div>
    </>
}

type FollowerCountType = Pick<UserInfo, 'followers' | 'following'>;

export function FollowersBox(props: FollowerCountType) {
    return <>
        <div className="flex flex-row w-full justify-center">
            <CustomBox name="Followers" count={props.followers} />
            <CustomBox name="Following" count={props.following} />

        </div>
    </>
}

export function UserDescBox({ desc }: { desc: string }) {
    return <>
        <div className='text-white text-center my-4'>{desc}</div>
    </>
}