import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DarkButton, LightButton } from '../../components/shared/Buttons';
import { selectUser } from '../../store/authSelectors';
import { clearUser } from '../../store/authSlice';
import { api } from '../../http';

const VerificationStatusPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const email = user?.email || 'your account';

    const handleLogoutAndRestart = async () => {
        try {
            await api.get('/auth/logout'); 
        } catch (e) {
            console.error("Logout API failed, forcing local clear.");
        }
        dispatch(clearUser()); // Clear Redux state
        navigate('/signin', { replace: true });
    };

    const handleResendCode = async () => {
        try {
            await api.post('/auth/email/resend-verification', { email: user?.email }); 
            alert("New verification code sent! Please check your email.");
            navigate('/submitotp', { replace: true });
        } catch (e) {
            alert("Failed to resend code. Please try again later.");
        }
    };

    return (
        <div className="flex flex-col items-center p-8 bg-[#0B1D23] rounded-lg shadow-2xl text-white w-[80%] mx-auto my-10">
            <h2 className="text-2xl mb-4 text-[#71E8DF]">Verification Pending</h2>
            <p className="text-center mb-6 text-gray-300">
                Your account for **{email}** is not yet verified. Please complete verification to continue.
            </p>
            
            <div className="flex flex-col w-full items-center gap-3">
                
                {/* Option 1: Continue Verification */}
                <DarkButton name="Continue Verification" onclick={() => navigate('/submitotp')} />
                
                {/* Option 2: Resend Code */}
                <LightButton name="Resend Code" onclick={handleResendCode} />
                
                {/* Option 3: Log out and start fresh */}
                <button 
                    onClick={handleLogoutAndRestart} 
                    className="text-sm text-red-400 mt-2 underline"
                >
                    Log Out and Use Another Email
                </button>
            </div>
        </div>
    );
};

export default VerificationStatusPage;