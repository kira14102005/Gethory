
import { LoginSubmitButton } from '../../components/shared/Buttons'
import { CodeInput } from '../../components/shared/Input'
import { LightNavbar } from '../../components/shared/Navigation'
import { TitleCard } from '../../components/shared/Card'
import './Validation.module.css'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { sendVerificationCode } from '../../http'
export function ValidateOTP() {
    const [codeState, setCode] = useState({ code: '' })
    const navigate = useNavigate()
    function verifyCode(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(codeState)
        // setTimeout(()=>{}, 3000)
        sendVerificationCode(codeState.code).then((res) => {
            console.log(res.data)
            // user.authenticated = true
            navigate('/auth', {})

        }).catch((err) => {
            console.log(err)
        })
    }
    return <>

        <div className='flex flex-row w-screen min-h-screen'>
            <div className='w-[60%]'>
                <LightNavbar />
                <div className="ml-[40px] my-2 w-[90%] flex flex-col">
                    <TitleCard title='Enter the OTP' subtitle='Please enter the 6-digit Verification Code we just texted you' />
                    <form onSubmit={verifyCode}>
                        <div className='flex flex-row w-[80%] h-[6vw] justify-between my-3'>
                            <CodeInput id='103' value='code' setValue={setCode} />

                        </div>
                        <LoginSubmitButton name='Enter Code' onclick={() => { }} />
                    </form>


                </div>
            </div>
            <div className='w-[40%] min-h-full overflow-y-fill bg-gradient-to-r [background-image:linear-gradient(to_right,_#1A202C_0%,_#394660_57%,_#566A92_100%)]'>
            </div>
        </div>
    </>
}