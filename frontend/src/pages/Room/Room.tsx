import { CreateRoomButton, DarkButton } from "../../components/shared/Buttons";
import { MeetingCard, MenuCard, type MeetingDetailsProps } from "../../components/shared/Card"
import { GreyInput, SearchInput } from "../../components/shared/Input";
import { SectionType2 } from "../../components/shared/Section"
import { useCallback, useMemo, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { MeetingArray, roomArr, type roomDetails } from "./constants";


const Room = () => {
    const [showRoomModel, setShowRoomModel] = useState(false)
    const handleClick = useCallback(() => {
        setShowRoomModel(true)
    }, [setShowRoomModel])
    const onClose = useCallback(() => {
        setShowRoomModel(false)
    }, [setShowRoomModel])
    const opacity = useMemo(() => {
        return showRoomModel ? '30%' : ''
    }, [showRoomModel])
    return (
        <SectionType2>
            <div className="flex h-full w-full justify-center">
                <div className="flex flex-col w-full h-full place-items-center"  style={{ opacity: opacity }}>
                    <VoiceBar onclick={handleClick} />
                    <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full h-full">
                        
                        {MeetingArray.map((meet: MeetingDetailsProps, i) => {
                            return <MeetingCard key={i} title={meet.title} count={meet.count} authors={meet.authors}></MeetingCard>
                        })}

                    </div>
                </div>
                {showRoomModel && <RoomModel onclose={onClose} />}

            </div>

        </SectionType2>

    )
}

export function VoiceBar({ onclick }: { onclick: () => void }) {
    return (
        <>
            <div className="flex w-full h-fit flex-row items-center justify-between">
                <MenuCard title="All voice rooms" />
                <SearchInput />
                <CreateRoomButton name="Start a room" onclick={onclick} />
            </div>
        </>
    )
}


const RoomModel = ({ onclose }: { onclose: () => void }) => {
    const [room, setRoom] = useState(0)

    return <>
        <div className='z-10 fixed w-[70%] lg:w-[50%]  md:w-[60%] rounded-2xl flex flex-col bg-[#1A202C] py-5 px-6 gap-2 text-[20px]'>
            <h1 className='text-[20px]'>Enter the topic to be discovered</h1>
            <button onClick={onclose} className='absolute top-2 right-2 cursor-pointer' >
                <CloseIcon fontSize='small' />
            </button>
            <GreyInput />
            <div className='bg-[#d9d9d9] h-[1px] opacity-60 w-full'></div>
            <div className='flex flex-col gap-4'>
                <h1>Room Type</h1>
                <div className='w-full hover:cursor-pointer  grid grid-cols-3'>
                    {roomArr.map((elem: roomDetails, i: number) => {
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
                            <div className='flex flex-col place-items-center border-white border-[3px]  rounded-lg py-2' style={{ borderStyle: 'ridge', boxShadow: 'inset 0 0 4px 3px rgba(42, 48, 53, 1)' }} onClick={() => {
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
    </>
}

export default Room
