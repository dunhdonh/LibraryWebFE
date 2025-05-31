import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookCRUDTable from '../../component/AdminComponent/BookCRUDTable';
import UserCRUDTable from '../../component/AdminComponent/UserCRUDTab';
import BorrowingTab from '../../component/AdminComponent/BorrowingTab';
import SummaryTab from '../../component/AdminComponent/SummaryTab';
import Alert from '../../component/Alert';
import { useDispatch } from 'react-redux';
import { setAvatar } from '../../redux/userSlice';


const AdminPage = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [activeTab, setActiveTab] = useState('summary');
    const [alert, setAlert] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storedUser = useSelector((state) => state.user.currentUser);

    if (!user) return null;

    return (
        <div className="max-w-6xl min-h-screen mx-auto p-6 bg-white ">
            <h1 className="text-2xl font-bold mb-4">Quản lý thư viện</h1>

            {/* Tabs + Content */}
            <div className="flex flex-col bg-white rounded">
                {/* Tabs */}
                <div className=" border-b border-b-0">
                    <div className=" overflow-x-auto flex flex-row border-b  ">
                        {[
                            { key: 'summary', label: 'Tổng quan' },
                            { key: 'books', label: 'Sách' },
                            { key: 'borrowings', label: 'Đơn mượn' },
                            { key: 'users', label: 'Người dùng' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-shrink-0 whitespace-nowrap py-2 px-5 border-r hover:bg-blue-50 ${activeTab === tab.key ? 'bg-blue-100 font-semibold text-blue-700' : ''
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Nội dung tab */}
                <div className="pt-6">
                    {activeTab === 'summary' && <SummaryTab />}    
                    {activeTab === 'books' && <BookCRUDTable />}
                    {activeTab === 'borrowings' && <BorrowingTab />}
                    {activeTab === 'users' && <UserCRUDTable/>}
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

export default AdminPage;
