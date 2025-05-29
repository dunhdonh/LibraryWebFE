import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../API/apiCaller'; // Hàm gọi API đăng ký

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp huhu');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Email không hợp lệ');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (username.length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự');
            return;
        }
        if (username.length > 20) {
            setError('Tên đăng nhập không được quá 20 ký tự');
            return;
        }

        const avatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'; // Đặt avatar mặc định
        try {
            const newUser = { username, email, avatar, password };
            await registerUser(newUser); // Gọi API để đăng ký người dùng mới
            navigator('/login'); // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message); // Lấy lỗi message từ throw new Error()
            } else {
                setError('Đăng ký thất bại, vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {error && (
                        <div className="mb-4 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Đăng ký
                    </button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-sm">Đã có tài khoản? </span>
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
