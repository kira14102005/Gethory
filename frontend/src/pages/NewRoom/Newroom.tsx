import { SectionType2 } from "../../components/shared/Section"
import { MenuCard } from "../../components/shared/Card"
import MicOffIcon from '@mui/icons-material/MicOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MicIcon from '@mui/icons-material/Mic';
import FrontHandIcon from '@mui/icons-material/FrontHand';
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/authSelectors"
import styles from './Newroom.module.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonWithLogo } from "../../components/shared/Buttons";
import { useEffect, useState } from "react";
import { getRoomDetails } from "../../http/utils";
import { useWebRTCVersion2 , type ClientInterface} from "../../hooks/useWebRTCVer2";

export interface RoomInterface {
  userId: string;
  topic: string;
  roomType: string;
  createdAt: Date;
  speakers: string[]
}
const Newroom = () => {
  const navigate = useNavigate()
  const [room, setRoom] = useState<RoomInterface | null>(null)
  const { id: roomId } = useParams()

  const handleManualLeave = () => {
    navigate('/rooms', { replace: true });
  };
  useEffect(() => {
    const fetchRoomDetails = async () => {
      const { data } = await getRoomDetails(roomId)
      console.log(data)
      //@ts-ignore
      setRoom((prev) => data.room)
    }
    fetchRoomDetails()
  }, [roomId])
  return (
    <div className="flex flex-col items-center">
      <SectionType2>
        <div className="flex space-x-3">
          <button onClick={handleManualLeave}>
            <ArrowBackIcon fontSize="inherit" />
          </button>
          <span className={styles.linkUnderline}>All Voice Rooms</span>
        </div>
      </SectionType2>
      <div className="flex flex-col m-5 space-y-2 w-[95%] h-fit">
        <div className="flex justify-between w-full">
          <MenuCard title={room?.topic ?? ""} />
          <div className="flex space-x-3">  <ButtonWithLogo name="Raise hand" logo={FrontHandIcon} onclick={handleManualLeave} />
            <ButtonWithLogo name="Leave Quietly" logo={ExitToAppIcon} onclick={handleManualLeave} />

          </div>
        </div>
        <div>
          <Joinee roomId={roomId} />
        </div>
      </div>
    </div>
  )
}
const Joinee = ({ roomId }: { roomId: string | undefined }) => {
  const user = useSelector(selectUser)
  //@ts-ignore
  const { clients, provideRef, handleMute } = useWebRTCVersion2(roomId, user)
  const [isMute, setMute] = useState(true)
  useEffect(() => {
    handleMute(isMute, user?._id)
  }, [isMute])

  const handleMuteClick = (clientId: string) => {

    if (clientId !== user?._id) return; //be able mute yourself only
    setMute(prev => !prev)
    console.log('Handle Muteclick : ', isMute)
  }
  return <>

    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 items-center w-full">
      {clients.map((client: ClientInterface) => {
        return <div className="w-fit m-3 flex flex-col items-center justify-self-center col-span-1" key={client._id}>
          <div className={styles.userHead}>
            <audio ref={(instance) => provideRef(instance, client._id)} autoPlay></audio>
            <img className={styles.userAvatar}
              //@ts-ignore
              src={client.avatar} alt="" />
            <button onClick={() => { handleMuteClick(client._id) }} className={styles.micBtn}>{client.muted ? <MicOffIcon fontSize="inherit" /> : <MicIcon fontSize="inherit" />}</button>
          </div>
          <h4>{client.name}</h4>
        </div>

      })}
    </div>
  </>
}
export default Newroom
