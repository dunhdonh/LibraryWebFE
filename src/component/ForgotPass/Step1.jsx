import React from 'react'
import { useState } from 'react';


const Step1 = ({ onNext }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(email); // gọi bước tiếp theo với email
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Quên mật khẩu</h2>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="w-full px-3 py-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">Gửi mã OTP</button>
            </form>
        </div>
    );
};
export default Step1;