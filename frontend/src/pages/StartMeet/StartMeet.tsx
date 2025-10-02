import Room from '../Room/Room'
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import { DarkButton } from '../../components/shared/Buttons';
import { Link } from 'react-router-dom';
import { GreyInput } from '../../components/shared/Input';
import { useState, type ReactElement } from 'react';

interface roomDetails {
    roomType: string,
    emoji: ReactElement
}

const roomArr: roomDetails[] = [
    {
        roomType: 'Public',
        emoji: <PublicIcon />
    }
    ,
    {
        roomType: 'Group',
        emoji: <PeopleIcon />
    }
    ,
    {
        roomType: 'Private',
        emoji: <LockIcon />
    }
    ,

]
const StartMeet = () => {
    const [room, setRoom] = useState(0)
    return (
        <>
            <div className='w-full h-full flex place-items-center justify-center relative'>
                <div className='absolute top-0 left-0 w-full h-fit opacity-20'>
                    <Room />
                </div>
                <div className='fixed w-[70%] lg:w-[50%]  md:w-[60%] rounded-2xl flex flex-col bg-[#1A202C] py-5 px-6 gap-2 text-[20px]'>
                    <h1 className='text-[20px]'>Enter the topic to be discovered</h1>
                    <Link to={'/room'} className='absolute top-2 right-2 cursor-pointer' >
                        <CloseIcon fontSize='small' />
                    </Link>
                    <GreyInput />
                    <div className='bg-[#d9d9d9] h-[1px] opacity-60 w-full'></div>
                    <div className='flex flex-col gap-4'>
                        <h1>Room Type</h1>
                        <div className='w-full hover:cursor-pointer  grid grid-cols-3'>
                            {roomArr.map((elem : roomDetails, i : number) => {
                                let Emoji = elem.emoji;
                                if (i != room)
                                    return <>
                                        <div className='flex flex-col place-items-center shadow-xl' onClick={() => {
                                            setRoom(i)
                                        }}>
                                            {Emoji}
                                            <p className='text-[16px] text-[#d9d9d9] opacity-50'>{elem.roomType}</p>
                                        </div>
                                    </>
                                else return <>
                                    <div className='flex flex-col place-items-center border-white border-[3px]  rounded-lg py-2' style={{borderStyle : 'ridge', boxShadow:'inset 0 0 4px 3px rgba(42, 48, 53, 1)' }} onClick={() => {
                                        setRoom(i)
                                    }}>
                                        {Emoji}
                                        <p className='text-[16px] text-[#d9d9d9] opacity-50'>{elem.roomType}</p>
                                    </div>
                                </>
                            })}

                        </div>
                        <div className='w-full flex justify-center text-[16px] text-[#d9d9d9] opacity-50'>Start a room, open to everyone</div>
                        <div className='flex w-full justify-center'><DarkButton name="Let's go" onclick={() => { }} /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StartMeet
