import { SectionType2 } from "../../components/shared/Section"
import { MenuCard } from "../../components/shared/Card"
import { useWebRTC, type ClientInterface } from "../../hooks/useWebRTC"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/authSelectors"
import styles from './Newroom.module.css'
const Newroom = () => {

  return (
    <div>
      <SectionType2>
        <MenuCard title="All connected clients" />
      </SectionType2>
      <Joinee />
    </div>
  )
}
const Joinee = () => {
  const { id: roomId } = useParams()
  const user = useSelector(selectUser)
  //@ts-ignore
  const { clients, provideRef } = useWebRTC(roomId, user)
  return <>

    <div>
      {clients.map((client: ClientInterface) => {
        return <div className="w-fit m-3 flex flex-col items-center" key={client._id}>
          <div className={styles.userHead}>
            <audio ref={(instance) => provideRef(instance, client._id)} autoPlay></audio>
            <img className={styles.userAvatar}
              //@ts-ignore
              src={client.avatar} alt="" />
          </div>
          <h4>{client.name}</h4>
        </div>

      })}
    </div>
  </>
}
export default Newroom
