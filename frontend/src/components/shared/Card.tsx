import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './components.module.css'
interface CardProps {
    title: string,
    subtitle?: string
}
export function TitleCard(props: CardProps) {
    return <>
        <div className="text-[33.3px] h-[35px] text-[#1A202C]">
            {props.title}
        </div>
        <div className="text-[16px] text-[#4A5568] mt-0">
            {props.subtitle}
        </div>
    </>
}
export function LighttitleCard(props: CardProps) {
    return <>
        <div className="text-3xl text-center">
            {props.title}
        </div>
        <div className="text-[16px] text-[#9E9E9E] text-center">
            {props.subtitle}
        </div>
    </>
}

export function MenuCard(props: CardProps) {
    return <>
        <div className={`${styles.linkUnderline} text-white border-b-[2px] border-[#71E8DF] pr-2 `}>
            {props.title}
        </div>
    </>
}

export function CustomBox({ name, count }: { name: string, count: number }) {
    return <>
        <div className="mx-1 aspect-square rounded-lg bg-[#414A5B]  max-w-[100px] max-h-[100px] bg-opacity-60 flex flex-col items-center justify-center">
            <span className="text-[27px] text-white">{count}</span>
            <span className="text-[13px] text-white opacity-[60%]">
                {name}
            </span>


        </div>
    </>
}

export interface MeetingDetailsProps {
    _id: any,
    topic: string,
    authors: any,
    count: number
}
export const MeetingCard = memo((props: MeetingDetailsProps) => {

    let count;
    const navigate = useNavigate()
    if (props.count <= 0) count = ""
    else if (props.count < 100) {
        count = props.count.toString()
    }
    else if (props.count < 200) {
        count = "100+"
    }
    else if (props.count < 300)
        count = "200+"
    else if (props.count < 400)
        count = "300+"
    else if (props.count < 1000)
        count = "500+"
    else {
        let mul = Math.floor(props.count / 1000);
        count = `${mul}k+`
    }
    const authors = [props.authors[0].name, '']
    const onclick = useCallback(() => { navigate(`/newroom/${props._id}`, { replace: true }) }, [])
    const avatars = [props.authors[0].avatar, '/profile.png']
    let onlyOne;
    if (props.authors.length === 1) onlyOne = true
    let styling;
    if (onlyOne) styling = 'w-[46px] h-[46px] md:w-[56px] md:h-[56px]  bg-[#566AA6] rounded-full  overflow-hidden flex flex-row justify-center items-center'
    else styling = 'absolute w-[43px] h-[43px] md:w-[53px] md:h-[53px]  bg-[#566AA6] z-0 rounded-full  top-0 left-0 overflow-hidden flex flex-row justify-center items-center'
    return <>
        <div className="hover:cursor-pointer col-span-1 flex flex-col place-items-center p-1 md:p-3 m-3 bg-[#1A202C] h-fit rounded-2xl w-[170px] md:w-[200px] mx-auto" onClick={onclick}>
            <h1 className="text-lg text-white">{props.topic}</h1>
            <div className={`flex w-[80%] justify-between h-fit`}>
                <div className={!onlyOne ? `relative h-[60px]` : ''}>
                    <div className={styling}>
                        <div className='absolute w-[43px] rounded-full overflow-hidden flex flex-row items-center justify-center'>
                            <img src={avatars[0]} alt="" className='cover' />
                        </div>
                    </div>
                    {!onlyOne && <div className='absolute w-[43px] h-[43px] md:w-[53px] md:h-[53px]  z-10 bg-[#DB9C50] rounded-full top-5 left-4 overflow-hidden flex flex-row justify-center items-center'>
                        <div className='w-[90%] h-[90%] rounded-full overflow-hidden flex flex-row items-center justify-center'>
                            <img src=
                                {avatars[1]} alt="" className='cover' /></div>
                    </div>}
                </div>
                <div className='flex flex-col'>
                    <span className='flex gap-1 items-center text-[14px]'>
                        <p>{authors[0].split(' ')[0]}</p>
                        <ForumIcon fontSize='inherit' />
                    </span>
                    {!onlyOne && <span className='flex gap-1 items-center text-[14px]'>
                        <p>{authors[1].split(' ')[0]}</p>
                        <ForumIcon fontSize='inherit' />
                    </span>}
                </div>
            </div>
            <div className='w-full flex justify-end text-[14px] mb-1 mr-1 md:mr-0 md:mb-0'>
                <span className='flex items-center gap-1'><p>{count}</p>
                    <PersonIcon fontSize='inherit' />
                </span>
            </div>
        </div>
    </>

})
