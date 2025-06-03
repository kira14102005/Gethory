interface ButtonProps {
    onclick: () => void,
    name: string

}
export function LightButton(
    props: ButtonProps
) {
    return <>
        <button className="bg-[#16A394] border-[#71E8DF] border-[3px] w-fit rounded-md" onClick={props.onclick}>
            {props.name}
        </button>
    </>
}