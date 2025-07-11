interface ButtonProps {
    onclick: () => void,
    name: string,
    path?: string
}
export function DarkButton(
    props: ButtonProps
) {
    return <>
        <button className="bg-[#16A394] btn border-[#71E8DF] border-[3px] px-[20px] w-fit rounded-lg" onClick={props.onclick}>
            {props.name}
        </button>
    </>
}
export function LightButton(
    props: ButtonProps
) {
    return <>
        <button className="text-[#71E8DF] lightBtn border-[#FFFFFF] border-[3px] px-[20px] w-fit rounded-lg" onClick={props.onclick}>
            {props.name}
        </button>
    </>
}

export function SigninButton(props: ButtonProps) {
    return <>
        <button className="bg-[#D9D9D9] hover: border border-black p-1 rounded-md flex flex-row justify-center items-center w-[75%]">
            <div className="flex flex-row w-fit items-center ">
                <img className="w-[24px] h-[24px] mx-2" src={props.path} alt="" />
                <span className="text-[#1A202C]">{props.name}</span>
            </div>
        </button>
    </>

}
export function LoginSubmitButton(props: ButtonProps) {
    return <>
        <button className="bg-[#0B1D23] border border-[#4A5568] p-1 rounded-md flex flex-row justify-center items-center w-[75%]">
            <div className="flex flex-row w-fit items-center ">
                <span className="text-white">{props.name}</span>
            </div>
        </button>
    </>

}