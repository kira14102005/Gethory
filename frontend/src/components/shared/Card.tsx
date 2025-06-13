import ForumIcon from '@mui/icons-material/Forum';
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

interface MeetingDetailsProps {
    title: string,
    authors: string,
    count: number
}
export function MeetingCard(props : MeetingDetailsProps) {
    return <>
    <div className="col-span-1 flex flex-col place-items-center p-5 bg-[#1A202C] h-fit rounded-2xl">
        <h1 className="text-lg text-white">{props.title}</h1>
        <div className="flex w-full justify-between px-5 items-center h-[100px]">
            <div className="relative -top-8">
                <div className='absolute w-[50px] h-[50px] bg-[#566AA6] z-0 rounded-full bg- top-0 left-0'></div>
                <div className='absolute w-[50px] h-[50px] z-10 bg-[#DB9C50] rounded-full top-5 left-4'></div>
            </div>
            <div className='flex flex-col'>
                <span className='flex gap-3 items-center text-[14px]'>
                    <p>Author</p>
                    <ForumIcon fontSize='' />
                </span>
                <span className='flex gap-3 items-center text-[14px]'>
                    <p>Author</p>
                    <ForumIcon fontSize='' />
                </span>
            </div>
        </div>
        <div>

        </div>

    </div>
    </>

}
