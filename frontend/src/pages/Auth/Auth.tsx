
import { memo, useCallback, useEffect, useState } from "react";
import { DarkButton } from "../../components/shared/Buttons";
import { AuthInput } from "../../components/shared/Input";
import { NavbarWithLogout } from "../../components/shared/Navigation";
import { LighttitleCard } from "../../components/shared/Card";
import './Auth.module.css'
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { activate } from "../../http";
import { updateUserProfile } from "../../store/authSlice";
import { selectActivate, selectAvatar, selectName, selectUsername } from "../../store/activateSelectors";
import { setAvatar, setName, setUsername } from "../../store/activateSlice";
import AvatarComponent from "../../components/shared/Avatar";
import { Loader3 } from "../../components/shared/LoaderOptions";



export function Auth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentActiveState = useSelector(selectActivate);



    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);



    // This handler runs when the user finishes all steps.
    const handleUpdate = useCallback(async () => {
        if (isUpdating) return;

        setError(null);
        setIsUpdating(true);

        try {
            const res = await activate(currentActiveState);
            //@ts-ignore
            const updatedUser = res.data.user;

            // 1. SUCCESS: Dispatch action to update RTK store with the confirmed data

            dispatch(updateUserProfile(updatedUser));

            // 2. Redirect to the main application page.
            navigate('/profile', { replace: true });

        } catch (err: any) {
            // 3. FAILURE: Log and set error state
            const errorMessage = err.response?.data?.Error || "Network or server error during update.";
            setError(errorMessage);
            console.error("Profile update failed:", err);
            setIsUpdating(false);
        }
    }, [currentActiveState, isUpdating, dispatch, navigate]);
    let content;
    switch (step) {
        case 0:
            content = <MainCard setStep={setStep} />;
            break;
        case 1:
            content = <Step2Card setStep={setStep} />;
            break;
        case 2:
            content = <Step3Card setStep={setStep} />;
            break;
        case 3:
            // Placeholder for the FINAL API SUBMISSION (Step 4)
            content = <Step4Card handleUpdate={handleUpdate} isUpdating={isUpdating} error={error} />;
            break;
        default:
            content = <Navigate to={'/profile'} />;
            break;
    }
    return <>
        <NavbarWithLogout />
        <div className="w-full h-full flex flex-row justify-center items-center">
            {content}
        </div>
    </>
}
interface StepProps {
    setStep: React.Dispatch<React.SetStateAction<number>>;

}

export const MainCard = memo(
    ({ setStep }: StepProps) => {
        const dispatch = useDispatch()
        const currName = useSelector(selectName)
        const [localName, setLocalName] = useState(currName);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setLocalName(value);
        }

        return <>
            <div className="relative w-full h-full flex flex-col items-center justify-center ">
                <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
                </div>
                <div className="absolute inset-0 z-10 w-[80%]mx-auto flex flex-col items-center py-5">
                    <LighttitleCard title="What Should We Call You?" />
                    <AuthInput label="name" value={localName} field="name" placeholder="Enter Your Name" handleChange={handleChange} />
                    <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                        <DarkButton name="Next" onclick={() => {
                            if (localName && localName.trim()) {
                                dispatch(setName(localName))
                                setStep((c: number) => c + 1)
                            }
                        }
                        } />
                    </div>
                </div>
            </div>
        </>
    })


export const Step2Card = memo(({ setStep }: { setStep: React.Dispatch<React.SetStateAction<number>> }) => {
    const name = useSelector(selectName)
    const dispatch = useDispatch()
    const initialState = useSelector(selectAvatar) ?? './profile.png'
    const [image, setImage] = useState(initialState)
    const displayString = `Okay ${name}, how's this avatar?`
    function captureImage(e: any) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            console.log(reader.result)
            //@ts-ignore
            setImage(reader.result)
            dispatch(setAvatar(reader.result))
        }

    }
    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[75%] max-h-[400px] md:max-h-[300px]  mx-auto flex flex-col items-center justify-around py-5">
                <LighttitleCard title={displayString} />
                <div className="flex flex-col items-center justify-evenly w-full">
                    <AvatarComponent img={image} />
                    <div className="mt-1 text-[#7FACCF] text-[15px] ">
                        <input type="file" id="avatarInput" className="hidden" onChange={captureImage} />
                        <label htmlFor="avatarInput" className="hover:underline hover:cursor-pointer hover:text-[#7FACCF]">
                            Choose a different avatar</label>
                    </div>

                </div>
                <div className="w-full flex flex-row justify-center w-[20%]">
                    <DarkButton name="Next" onclick={() => {

                        setStep((c: number) => c + 1)
                    }
                    } />
                </div>
            </div>
        </div>
    </>
})

export const Step3Card = memo(({ setStep }: StepProps) => {

    const currentUsername = useSelector(selectUsername)
    const [localusername, setlocalUserName] = useState(currentUsername);
    const dispatch = useDispatch()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setlocalUserName(value);
    }
    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center py-5 ">
                <LighttitleCard title="Pick a username" />
                <AuthInput label="Username" value={localusername} field="username" placeholder="Choose your username" handleChange={handleChange} />
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton name="Setup Profile" onclick={() => {
                        if (localusername && localusername.trim().length
                            >= 3) {

                            dispatch(setUsername(localusername))
                            setStep((c: number) => c + 1)
                        }

                    }
                    } />
                </div>
            </div>
        </div>
    </>
})
interface Step4Props {
    handleUpdate: () => Promise<void>;
    isUpdating: boolean;
    error: string | null;
}

export const Step4Card = memo(({ handleUpdate, isUpdating, error }: Step4Props) => {

    // Trigger the API call once the component mounts
    useEffect(() => {
        if (!isUpdating && !error) {
            handleUpdate();
        }
    }, [handleUpdate, isUpdating, error]);

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            {/* <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center justify-between">
                <LighttitleCard title="Seting up your Gethory account" />
                <div className="flex flex-col items-center w-full">
                    <div className="w-[23vh] h-[23vh] border-r-[#D9D9D9] animate-spin border-[2vh] border-[#71E8DF] bg-transparent rounded-full"></div>
                </div>

            </div> */}
            <Loader3 />
        </div>
    </>
})

