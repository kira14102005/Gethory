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
        <div className="text-[33.3px] h-[35px] text-[30px] mt-[5%]">
            {props.title}
        </div>
        <div className="text-[16px] text-[#9E9E9E] mt-0">
            {props.subtitle}
        </div>
    </>
}

export function MenuCard(props: CardProps) {
    return <>
        <div className="text-white text-[20px] pb-3 pr-2 h-[35px] border-b-[3px] border-[#71E8DF] w-max ">
            {props.title}
        </div>
    </>
}

export function CustomBox({ name, count }: { name: string, count: number }) {
    return <>
        <div className="mx-1 aspect-square rounded-lg bg-[#414A5B] max-w-[100px] max-h-[100px] bg-opacity-60 flex flex-col items-center justify-center">
            <span className="text-[27px] text-white">{count}</span>
            <span className="text-[13px] text-white opacity-[60%]">
                {name}
            </span>


        </div>
    </>
}