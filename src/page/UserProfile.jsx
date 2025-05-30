import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getBorrowedBooks } from '../API/apiCaller';
import UserInfo from '../component/UserProfileTab/UserInfo';
import { useSelector } from 'react-redux';
import EditProfileForm from '../component/UserProfileTab/EditProfileForm';
import BorrowingList from '../component/UserProfileTab/BorrowingList';
import BorrowHistoryTable from '../component/UserProfileTab/BorrowHistoryTable';
import Alert from '../component/Alert';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../redux/userSlice';


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [alert, setAlert] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
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
    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            if (user && user._id) {
                try {
                    const books = await getBorrowedBooks(user._id, '');
                    setBorrowedBooks(books);
                } catch (error) {
                    console.error("Failed to fetch borrowed books:", error);
                }
            }
        }
        fetchBorrowedBooks();
    }, [user]);


    const handleUpdateProfile = async (updatedData) => {
        try {
            const updatedUser = await updateUserProfile(user._id, updatedData);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setAlert({ message: 'Chỉnh sửa thông tin thành công!', type: 'success', id: Date.now() });
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
        <div className="max-w-5xl min-h-screen mx-auto mt-10 p-4 sm:p-6 bg-white shadow rounded">
            {/* Thông tin cơ bản */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 mb-6 text-center sm:text-left">
                <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border mb-4 sm:mb-0" />
                <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-blue-500 mt-1">{user.role}</p>
                </div>
            </div>

            {/* Tabs + Content */}
            <div className="flex flex-col bg-white rounded">
                {/* Tabs */}
                <div className=" border-b border-b-0 p-4">
                    <div className=" overflow-x-auto flex flex-row border-b p-4 space-x-2 ">
                        {[
                            { key: 'info', label: 'Thông tin cá nhân' },
                            { key: 'borrowed', label: 'Sách đang mượn' },
                            { key: 'history', label: 'Lịch sử mượn' },
                            { key: 'edit', label: 'Chỉnh sửa thông tin' },
                            { key: 'password', label: 'Đổi mật khẩu' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-shrink-0 whitespace-nowrap py-2 px-3 rounded hover:bg-blue-50 ${activeTab === tab.key ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Nội dung tab */}
                <div className=" p-4">
                    {activeTab === 'info' && <UserInfo user={user} />}
                    {activeTab === 'borrowed' && <BorrowingList />}
                    {activeTab === 'history' && <BorrowHistoryTable data={borrowedBooks} />}
                    {activeTab === 'edit' && (
                        <EditProfileForm
                            user={user}
                            onSubmit={(updatedUser) => {
                                handleUpdateProfile(updatedUser);
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                            }}
                        />
                    )}
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
