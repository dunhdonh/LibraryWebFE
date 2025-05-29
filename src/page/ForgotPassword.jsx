import { useState } from "react";
import Step1 from "../component/ForgotPass/Step1";
import Step2 from "../component/ForgotPass/Step2";
import Step3 from "../component/ForgotPass/Step3";
import { sendOTP, verifyOTP, resetPassword } from "../API/apiCaller";
import Alert from "../component/Alert";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [OTPToken, setOTPToken] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();


    const handleSendEmail = (emailInput) => {
        setEmail(emailInput);
        // Gửi email tới API để gửi mã OTP
        sendOTP(emailInput)
            .then((res) => {
                const token = res.token; // Giả sử API trả về token
                setOTPToken(token); // Lưu token để xác thực OTP sau này
                console.log("OTP sent to:", emailInput);
                setAlert({ message: "Mã OTP đã được gửi đến email của bạn.", type: "success" });
                setStep(2);


            })
            .catch((error) => {
                console.error("Error sending OTP:", error);
                setAlert({ message: "Gửi mã OTP thất bại. Vui lòng thử lại.", type: "error" });
            }
        );

    };

    const handleVerifyOtp = (otpInput) => {
        setOtp(otpInput);
        verifyOTP(OTPToken, otpInput)
            .then((res) => {
                setResetToken(res.resetToken); 
                console.log("OTP verified successfully:", res.data);
                setAlert({ message: "Mã OTP xác thực thành công.", type: "success" });
            }
            )
            .catch((error) => {
                console.error("Error verifying OTP:", error);
                setAlert({ message: "Xác thực mã OTP thất bại. Vui lòng thử lại.", type: "error" });
            }
        );

        setStep(3);
    };

    const handleResetPassword = (newPassword) => {
        resetPassword (resetToken, newPassword);
        setAlert({ message: "Mật khẩu đã được cập nhật thành công.", type: "success" });
        setTimeout(() => {
            navigate("/login");
        }, 2000);

    }   

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            {step === 1 && <Step1 onNext={handleSendEmail} />}
            {step === 2 && <Step2 onNext={handleVerifyOtp} />}
            {step === 3 && <Step3 onReset={handleResetPassword} />}
            {alert && <Alert message={alert.message} type={alert.type} />}
        </div>
    );
};

export default ForgotPassword;
