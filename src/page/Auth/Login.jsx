import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../API/apiCaller.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigator = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await login(username, password);

    // Lưu accessToken và refreshToken
    localStorage.setItem('token', data.token.accessToken);
    localStorage.setItem('refreshToken', data.token.refreshToken);
    const decodedUser = jwtDecode(data.token.accessToken);


    // Lưu thông tin user vào localStorage

    // Cập nhật thông tin user vào Redux
    dispatch(setUser(decodedUser));
    console.log('Đăng nhập thành công:', decodedUser);

    navigator('/'); // Chuyển hướng về trang chủ
  } catch (err) {
    console.error('Đăng nhập thất bại:', err);
  }
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="email">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                            required
                        />
                        <div className="text-right mt-2">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-sm">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-sm text-blue-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
