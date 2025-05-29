import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../API/apiCaller';
import UserInfo from '../component/UserInfo';
import { useSelector } from 'react-redux';
import EditProfileForm from '../component/EditProfileForm';
import BorrowingList from '../component/BorrowingList';
import Alert from '../component/Alert';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../redux/userSlice';


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storedUser = useSelector((state) => state.user.currentUser);
    useEffect(() => {
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (storedUser) {
                try {
                    const profile = await getUserProfile(storedUser._id);
                    setUser(profile);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    navigate('/login');
                }
            }
        };
        fetchUserProfile();
    }, [navigate]);

    const handleUpdateProfile = async (updatedData) => {
        try {
            const updatedUser = await updateUserProfile(user._id, updatedData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setAlert({ message: 'Chỉnh sửa thông tin thành công!', type: 'success' , id: Date.now() });
            setActiveTab('info'); // Quay lại tab thông tin sau khi cập nhật
            dispatch(setAvatar(updatedData.avatar)); // Cập nhật Redux store
            console.log("Cập nhật thông tin thành công:", updatedData);


        } catch (error) {
            console.error("Failed to update profile:", error);
            setAlert({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau', type: 'error', id: Date.now() });
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl min-h-screen mx-auto mt-10 p-6 bg-white shadow rounded">
            {/* Thông tin cơ bản */}
            <div className="flex items-center space-x-4 mb-6">
                <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-blue-500 mt-1">{user.role}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded flex">
                {/* Cột tab */}
                <div className="w-1/4 border-r pr-4">
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`text-left py-2 px-3 rounded hover:bg-blue-50 ${activeTab === 'info' ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                }`}
                        >
                            Thông tin cá nhân
                        </button>
                        <button
                            onClick={() => setActiveTab('borrowed')}
                            className={`text-left py-2 px-3 rounded hover:bg-blue-50 ${activeTab === 'borrowed' ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                }`}
                        >
                            Sách đang mượn
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`text-left py-2 px-3 rounded hover:bg-blue-50 ${activeTab === 'history' ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                }`}
                        >
                            Lịch sử mượn
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`text-left py-2 px-3 rounded hover:bg-blue-50 ${activeTab === 'edit' ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                }`}
                        >
                            Cập nhật thông tin
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`text-left py-2 px-3 rounded hover:bg-blue-50 ${activeTab === 'password' ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                }`}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>

                {/* Nội dung tab */}
                <div className="w-3/4 pl-6">
                    {activeTab === 'info' && <div>
                        <UserInfo user={user} />
                        </div>}
                    {activeTab === 'borrowed' && <div>
                        <BorrowingList />
                        </div>}
                        
                    {activeTab === 'history' && <div>Lịch sử mượn/trả ở đây</div>}
                    {activeTab === 'edit' && <div>
                        <EditProfileForm user={user} onSubmit={(updatedUser) => {
                            handleUpdateProfile(updatedUser);
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                        }} />
                        </div>}
                    
                        
                    {activeTab === 'password' && <div>Form đổi mật khẩu ở đây</div>}
                </div>

            </div>
            {alert && (
                <Alert
                    key={alert.id}
                    message={alert.message}
                    type={alert.type}
                    id={alert.id}
                />
            )}

        </div>
    );
};

export default UserProfile;
