
import { LoginSubmitButton } from '../../components/shared/Buttons'
import { OtpInput } from '../../components/shared/Input'
import { LightNavbar } from '../../components/shared/Navigation'
import { TitleCard } from '../../components/shared/TitleCard'
import './Validation.module.css'

export function ValidateOTP() {
    return <>

        <div className='flex flex-row w-screen h-full'>
            <div className='w-[60%] h-full'>
                <LightNavbar />
                <div className="ml-[40px] my-2 w-[90%] h-full flex flex-col" >
                    <TitleCard title='Enter the OTP' subtitle='Please enter the 6-digit Verification Code we just texted you' />
                    <form action="">
                        <div className='flex flex-row w-[80%] h-[6vw] justify-between my-3'>
                            <OtpInput id='otp1' />
                            <OtpInput id='otp2' />
                            <OtpInput id='otp3' />
                            <OtpInput id='otp4' />
                            <OtpInput id='otp5' />
                            <OtpInput id='otp6' />

                        </div>
                        <LoginSubmitButton name='Submit OTP' onclick={() => { }} />
                    </form>


                </div>
            </div>
            <div className='w-[40%] min-h-full overflow-y-fill bg-gradient-to-r [background-image:linear-gradient(to_right,_#1A202C_0%,_#394660_57%,_#566A92_100%)]'>
            </div>
        </div>
    </>
}