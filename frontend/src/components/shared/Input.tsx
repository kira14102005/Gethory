interface InputProps {
    label: string,
    placeholder?: string,
    id: string
}

export function SigninInput(props: InputProps) {
    return <>
        <div className="flex flex-col w-[75%]">
            <label className="text-black text-[22px]" htmlFor={props.label}>{props.label}</label>
            <input type="text" name={props.label} id={props.id} placeholder={props.placeholder} className="p-1 px-2 w-full border border -[#A0AEC0] rounded-md text-black text-[16px] font-100" />
        </div>
    </>

}
export function DarkInput(props : InputProps ){
    return <>
    <input className="text-white border border-white p-3 rounded-lg border-3px" type="text" name={props.label} id={props.id} placeholder={props.placeholder}/>
    </>
}
export function OtpInput({id} : {id : string}) {
    return <>
                <input type="text" id={id} className='w-[6vw] lg:w-[5vw] lg:h-[5vw] lg:rounded-lg text-black text-[20px] lg:text-[30px]  bg-[#D9D9D9] rounded-md border border-[#4A5568] text-center  shadow-lg'></input>
            </>
}