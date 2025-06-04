interface TitleCardProps {
    title: string,
    subtitle?: string
}
export function TitleCard(props: TitleCardProps) {
    return <>
        <div className="text-[33.3px] h-[35px] text-[#1A202C]">
            {props.title}
        </div>
        <div className="text-[16px] text-[#4A5568] mt-0">
            {props.subtitle}
        </div>
        </>
}
export function LighttitleCard(props: TitleCardProps) {
    return <>
        <div className="text-[33.3px] h-[35px] text-[30px] mt-[5%]">
            {props.title}
        </div>
        <div className="text-[16px] text-[#9E9E9E] mt-0">
            {props.subtitle}
        </div>
        </>
}