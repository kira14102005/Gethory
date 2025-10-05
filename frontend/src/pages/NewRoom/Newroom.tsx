import { SectionType2 } from "../../components/shared/Section"
import { MenuCard } from "../../components/shared/Card"
import MicOffIcon from '@mui/icons-material/MicOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FrontHandIcon from '@mui/icons-material/FrontHand';
import { useWebRTC, type ClientInterface } from "../../hooks/useWebRTC"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/authSelectors"
import styles from './Newroom.module.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ButtonWithLogo } from "../../components/shared/Buttons";
import { useEffect, useState } from "react";
const Newroom = () => {
  const navigate = useNavigate()
  const [room, setRoom] = useState({})
  const { id: roomId } = useParams()
  const topicMeet = 'My Meet on Ai'
  const handleManualLeave = () => {
    navigate('/rooms', { replace: true })
  }

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const { data } = await getRoomDetails(roomId)
      setRoom(data.room)
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
          <MenuCard title={topicMeet} />
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
  const { clients, provideRef } = useWebRTC(roomId, user)
  return <>

    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 items-center w-full">
      {clients.map((client: ClientInterface) => {
        return <div className="w-fit m-3 flex flex-col items-center justify-self-center col-span-1" key={client._id}>
          <div className={styles.userHead}>
            <audio ref={(instance) => provideRef(instance, client._id)} autoPlay></audio>
            <img className={styles.userAvatar}
              //@ts-ignore
              src={client.avatar} alt="" />
            <button className={styles.micBtn}><MicOffIcon fontSize="inherit" /></button>
          </div>
          <h4>{client.name}</h4>
        </div>

      })}
    </div>
  </>
}
export default Newroom
