interface SigninProps {
    label: string,
    placeholder?: string,
    id : string
}

export function SigninInput(props: SigninProps) {
    return <>
        <div className="flex flex-col w-[75%] my-2">
            <label className="my-1 text-black text-[23px]" htmlFor={props.label}>{props.label}</label>
            <input type="text" name={props.label} id={props.id} placeholder={props.placeholder} className="p-1 px-2 w-full border border -[#A0AEC0] rounded-md text-black text-[16px]"  />
        </div>
    </>

}