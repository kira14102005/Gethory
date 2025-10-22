
import { LoginSubmitButton } from '../../components/shared/Buttons'
import { CodeInput } from '../../components/shared/Input'
import { LightNavbar } from '../../components/shared/Navigation'
import { TitleCard } from '../../components/shared/Card'
import styles from './Validation.module.css'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateUserProfile } from '../../store/authSlice'
import { sendVerificationCode } from '../../http/utils'
export function ValidateOTP() {
    const [codeState, setCode] = useState({ code: '' })
    const dispatch = useDispatch()

    const navigate = useNavigate()
    function verifyCode(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(codeState)
        sendVerificationCode(codeState.code).then((res) => {
            //@ts-ignore
            const verifiedUser = res.data.user;
            dispatch(updateUserProfile({ verified: true }));
            navigate('/auth', {})

        }).catch((err) => {
            console.log(err)
        })
    }
    return <>


        <div className={`flex flex-row w-screen ${styles.dtop} min-h-screen`}>
            <div className='w-[60%]'>
                <LightNavbar />
                <div className="w-[90%] flex flex-col pl-8 pt-4">
                    <TitleCard title='Enter the OTP' subtitle='Please enter the 6-digit Verification Code'/>
                    <form onSubmit={verifyCode}>
                        <div className='flex flex-col space-y-5 w-[80%] justify-between '>
                            <CodeInput id='103' value='code' setValue={setCode} />


                            <LoginSubmitButton name='Enter Code' onclick={() => { }} />
                        </div>
                    </form>


                </div>
            </div>
            <div className='w-[40%] min-h-full overflow-y-fill bg-gradient-to-r [background-image:linear-gradient(to_right,_#1A202C_0%,_#394660_57%,_#566A92_100%)]'>
            </div>
        </div>
    </>
}