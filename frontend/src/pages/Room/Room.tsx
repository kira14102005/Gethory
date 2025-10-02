import { useNavigate } from "react-router-dom";
import { CreateRoomButton } from "../../components/shared/Buttons";
import { MeetingCard, MenuCard, type MeetingDetailsProps } from "../../components/shared/Card"
import { SearchInput } from "../../components/shared/Input";
import { SectionType2 } from "../../components/shared/Section"

const MeetingArray: MeetingDetailsProps[] = [
    {
        title: "AI Ethics and Governance",
        authors: ["Dr. Alice Morgan", "Prof. John Tan", "Laura Kim"],
        count: 58
    },
    {
        title: "Quantum Computing Trends",
        authors: ["Ethan Zhao", "Dr. Marie Chen"],
        count: 1007
    },
    {
        title: "Climate Tech Innovations",
        authors: ["Carlos Vega", "Sophie Grant", "Dr. Elena Petrov"],
        count: 2788
    },
    {
        title: "Cybersecurity in 2025",
        authors: ["Nina Brooks", "Oliver West"],
        count: 66
    },
    {
        title: "Sustainable Architecture",
        authors: ["Ava Thompson", "Dr. Ravi Singh"],
        count: 39
    },
    {
        title: "Future of Work",
        authors: ["Liam Carter", "Emily Zhang", "Marcus Bell"],
        count: 82
    },
    {
        title: "Space Tech Missions",
        authors: ["Dr. Naomi Watts", "Leo Fernandez"],
        count: 90
    },
    {
        title: "Smart City Planning",
        authors: ["Grace Lin", "Andrew Kumar"],
        count: 47
    },
    {
        title: "Digital Health Revolution",
        authors: ["Isabella Reed", "Thomas Müller", "Dr. Kate Morgan"],
        count: 55
    },
    {
        title: "Blockchain Beyond Crypto",
        authors: ["Maya Singh", "James Huang"],
        count: 60
    },
    {
        title: "Robotics in Everyday Life",
        authors: ["Victor Chan", "Ella Romano", "David Nwosu"],
        count: 78
    },
    {
        title: "AgriTech and Food Security",
        authors: ["Dr. Li Wei", "Hannah Patel"],
        count: 44
    },
    {
        title: "Ocean Conservation Tech",
        authors: ["Chris O'Donnell", "Fatima Noor", "Jun Yamamoto"],
        count: 63
    },
    {
        title: "Autonomous Vehicles Update",
        authors: ["Tina Brooks", "Haruto Sato"],
        count: 71
    },
    {
        title: "Augmented Reality in Education",
        authors: ["Rachel Stein", "Ahmed Salah"],
        count: 52
    },
    {
        title: "Green Energy Storage",
        authors: ["Sanjay Desai", "Olivia Carter", "Nikolai Petrov"],
        count: 69
    }
];


const Room = () => {
    return (
        <SectionType2>
            <VoiceBar />            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full h-full">
                {MeetingArray.map((meet: MeetingDetailsProps, i) => {
                    return <MeetingCard key={i} title={meet.title} count={meet.count} authors={meet.authors}></MeetingCard>
                })}

            </div>
        </SectionType2>

    )
}

export function VoiceBar() {
    const navigate = useNavigate()
    return (
        <>
            <div className="flex w-full h-fit flex-row items-center justify-between">
                <MenuCard title="All voice rooms" />
                <SearchInput />
                <CreateRoomButton name="Start a room" onclick={() => { navigate('/createroom') }} />
            </div>
        </>
    )
}

export default Room
