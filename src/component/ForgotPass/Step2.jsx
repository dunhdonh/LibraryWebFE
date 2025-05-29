import React from 'react'
import { useState, useRef } from 'react';

const Step2 = ({ onNext }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const inputRefs = useRef([]);
    const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus(); // focus ô tiếp theo
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // quay lại ô trước nếu xoá
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      // Gửi mã OTP tới API
      onNext(code);
    }
  };

  return (
                <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">

    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Nhập mã OTP</h2>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, i) => (
          <input
            key={i}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            ref={(el) => (inputRefs.current[i] = el)}
            className="w-10 h-10 text-center border rounded"
          />
        ))}
      </div>
      <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Xác nhận</button>
    </form>
    </div>
  );
};
export default Step2;