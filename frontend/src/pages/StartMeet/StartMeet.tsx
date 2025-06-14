import Room from '../Room/Room'
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import { DarkButton } from '../../components/shared/Buttons';
import { Link } from 'react-router-dom';
import { GreyInput } from '../../components/shared/Input';
const StartMeet = () => {
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
                        <div className='w-full  grid grid-cols-3'>
                            <div className='flex flex-col place-items-center'>
                                <PublicIcon fontSize='large' />
                                <p className='text-[16px] text-[#d9d9d9] opacity-50'>Open</p>
                            </div>
                            <div className='flex flex-col place-items-center'>
                                <PeopleIcon fontSize='large' />
                                <p className='text-[16px] text-[#d9d9d9] opacity-50'>Social</p>
                            </div>
                            <div className='flex flex-col place-items-center'>
                                <LockIcon fontSize='large' />
                                <p className='text-[16px] text-[#d9d9d9] opacity-50'>Private</p>
                            </div>

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
