import { SectionType2 } from "../../components/shared/Section"
import { MenuCard } from "../../components/shared/Card"
import { useWebRTC, type ClientInterface } from "../../hooks/useWebRTC"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../store/authSelectors"

const Newroom = () => {

  return (
    <div>
      <SectionType2>
        <MenuCard title="All joinees" />


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
        return <div key={client._id}>
          <audio ref={(instance) => provideRef(instance, client._id)} controls autoPlay></audio>
          <h4>{client.name}</h4>
        </div>

      })}
    </div>
  </>
}
export default Newroom
