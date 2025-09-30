
import { memo, useCallback, useEffect, useState } from "react";
import { DarkButton } from "../../components/shared/Buttons";
import { AuthInput } from "../../components/shared/Input";
import { NavbarWithLogout } from "../../components/shared/Navigation";
import { LighttitleCard } from "../../components/shared/Card";
import './Auth.module.css'
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { api } from "../../http";
import { updateUserProfile } from "../../store/authSlice";
import { selectActivate, selectName, selectUsername } from "../../store/activateSelectors";
import { setName, setUsername } from "../../store/activateSlice";



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
            const res = await api.put('/user/update_profile', currentActiveState);
            //@ts-ignore
            const updatedUser = res.data.user;

            // 1. SUCCESS: Dispatch action to update RTK store with the confirmed data
            dispatch(updateUserProfile({
                name: updatedUser.name,
                username: updatedUser.username,
                profileCompleted: updatedUser.profileCompleted
            }));

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
    // Navigate
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
                <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                    <LighttitleCard title="What Should We Call You?" />
                    <AuthInput label="name" value={localName} field="name" placeholder="Enter Your Name" handleChange={handleChange} />
                    <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                        <DarkButton name="Next" onclick={() => {
                            if (localName.trim()) {
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

    return <>
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="Okay, XYZ" subtitle="How's this photo?" />
                <div className="mt-5 flex flex-col items-center w-full">
                    <div className="w-[16vh] h-[16vh] border-[3px] border-[#4A5568] bg-[#DB9C50] rounded-full"></div>
                    <div className="mt-3 text-[#7FACCF] text-[15px]">Choose a different avatar</div>
                </div>
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
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
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center ">
                <LighttitleCard title="Pick a username" />
                <AuthInput label="Username" value={localusername} field="username" placeholder="Enter Your Name" handleChange={handleChange} />
                <div className="my-6 w-full flex flex-row justify-center w-[80%]">
                    <DarkButton name="Next" onclick={() => {
                        if (localusername.trim().length
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
            <div className="w-[80.67%] h-[75%] bg-[#0B1D23] rounded-2xl mx-auto absolute inset-0 z-0 blur-lg">
            </div>
            <div className="absolute inset-0 z-10 w-[80.67%] h-[50%] mx-auto flex flex-col items-center justify-between">
                <LighttitleCard title="Seting up your Gethory account" />
                <div className="flex flex-col items-center w-full">
                    <div className="w-[23vh] h-[23vh] border-r-[#D9D9D9] animate-spin border-[2vh] border-[#71E8DF] bg-transparent rounded-full"></div>
                </div>

            </div>
        </div>
    </>
})

