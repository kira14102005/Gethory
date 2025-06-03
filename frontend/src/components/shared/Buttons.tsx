interface ButtonProps {
    onclick: () => void,
    name: string

}
export function DarkButton(
    props: ButtonProps
) {
    return <>
        <button className="bg-[#16A394] border-[#71E8DF] border-[3px] px-[20px] w-fit rounded-lg" onClick={props.onclick}>
            {props.name}
        </button>
    </>
}
export function LightButton(
    props: ButtonProps
) {
    return <>
        <button className="text-[#71E8DF] border-[#FFFFFF] border-[3px] px-[20px] w-fit rounded-lg" onClick={props.onclick}>
            {props.name}
        </button>
    </>
}