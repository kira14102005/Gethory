import { MeetingCard } from "../../components/shared/Card"
import Section from "../../components/shared/Section"


const Room = () => {
    return (
        <Section>
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full h-full">
            
            <MeetingCard title={"What is the future of AI"} authors={["Virat Kohli", "Debby Carter"]} count={0}/>

            </div>
        </Section>
    )
}

export default Room
