interface InputProps<T> {
    label?: string,
    placeholder?: string,
    id: string,
    setValue: React.Dispatch<React.SetStateAction<T>>,
    value: string | null,
}

export interface UserInfoInterface {
    email: string,
    password: string
}

export function SigninInput(props: InputProps<UserInfoInterface>) {
    function handleUserInfoChange(e: any) {
        const field = props.value ?? ''
        props.setValue((u: UserInfoInterface) => {
            return { ...u, [field]: e.target.value }
        })
    }
    return <>
        <div className="flex flex-col ">
            <label className="text-black text-[22px]" htmlFor={props.label}>{props.label}</label>
            <input type="text" name={props.label} id={props.id}
                onChange={handleUserInfoChange} placeholder={props.placeholder} className="p-1 px-2 w-full border border -[#A0AEC0] rounded-md text-black text-[16px] font-100" />
        </div>
    </>

}
export type CodeInterface = {
    code: string
}
export function CodeInput(props: InputProps<CodeInterface>) {
    function handleUserInfoChange(e: any) {
        const field = props.value ?? ''
        props.setValue((u: CodeInterface) => {
            return { ...u, [field]: e.target.value }
        })
    }
    return <>
        <div className="flex flex-col w-[75%]">

            <input type="text" name={props.label} id={props.id}
                onChange={handleUserInfoChange} placeholder={props.placeholder} className="p-1 px-2 w-full border border -[#A0AEC0] rounded-md text-black text-[16px] font-100" />
        </div>
    </>

}
export function DarkInput(props: InputProps<UserInfoInterface>) {
    return <>
        <input className="text-white border border-white w-[10rem] text-center mt-5 bg-transparent px-3 rounded-lg border-[3px]" type="text" name={props.label} id={props.id} placeholder={props.placeholder} />
    </>
}

interface AuthInputInterface {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    value: string | undefined,
    field: string,
    label: string,
    placeholder: string
}
export function AuthInput(props: AuthInputInterface) {

    return <>
        <input className="text-white border border-white w-[10rem] text-center mt-5 bg-transparent px-3 rounded-lg border-[3px]" type="text" value={props.value} name={props.label} placeholder={props.placeholder} onChange={props.handleChange} />
    </>
}

export function OtpInput({ id }: { id: string }) {
    return <>
        <input type="text" id={id} className='w-[6vw] lg:w-[5vw] lg:h-[5vw] lg:rounded-lg text-black text-[20px] lg:text-[30px]  bg-[#D9D9D9] rounded-md border border-[#4A5568] text-center  shadow-lg'></input>
    </>
}
export function GreyInput({ onchange, value }: { onchange: (e: any) => void, value: string}) {
    return <>
        <input value={value} type="text" onChange={onchange} className='bg-[#414A5B] opacity-60 rounded-lg p-1' />
    </>
}
import SearchIcon from '@mui/icons-material/Search';
export function SearchInput() {
    return <>
        <div className="bg-[#414A5B] opacity-60 rounded-full p-1 flex flex-row">
            <input type="text" className="bg-transparent rounded-md w-full" />
            <SearchIcon />
        </div>

    </>
}