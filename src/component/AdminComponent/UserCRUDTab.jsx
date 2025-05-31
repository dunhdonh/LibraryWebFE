import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getAllUsers, updateUserProfile, getUserProfile, deleteUserByAdmin} from '../../API/apiCaller';
import { useEffect } from 'react';
import Alert from '../Alert';
const UserCRUDTable = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersArray, setUsersArray] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({name: '', email: '', role: '', avatar: '', phone: '', address: ''});

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const filteredUsers = usersArray.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? user.role === statusFilter : true;
        return matchesSearch && matchesStatus;
    });


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers({});
                setUsersArray(data.users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, address: user.address });
        setIsEditing(true);
    };

    const handleDeleteUser = (userId) => {
            deleteUserByAdmin(userId)
                .then(() => {
                    setUsersArray(usersArray.filter(user => user._id !== userId));
                    console.log("User deleted successfully");
                    setAlert({
                        id: Date.now(),
                        message: "Xoá người dùng thành công",
                        type: "success"
                    });
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    setAlert({
                        id: Date.now(),
                        message: "Xoá người dùng thất bại",
                        type: "error"
                    });
                });
    };

    const handleFormSubmit = (e) => {
        console.log("Form data submitted:", formData);
        e.preventDefault();
        
            updateUserProfile(selectedUser._id, formData)
                .then((updatedUser) => {
                    setUsersArray(usersArray.map(user => user._id === updatedUser._id ? updatedUser : user));
                    setIsEditing(false);
                    setSelectedUser(null);
                    setAlert({
                        id: Date.now(),
                        message: "Cập nhật người dùng thành công",
                        type: "success"
                    });
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                    setAlert({
                        id: Date.now(),
                        message: "Cập nhật người dùng thất bại",
                        type: "error"
                    });
                });

    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedUser(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
                {/* <button
                    onClick={handleAddClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm người dùng
                </button> */}
            </div>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm theo username hoặc email"
                    className="border p-2 rounded w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border p-2 rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả vai trò</option>
                    <option value="Admin">Admin</option>
                    <option value="Reader">Reader</option>

                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 min-w-20"></th>
                            <th className="p-2 text-left">Tên đăng nhập</th>
                            <th className="p-2 ">Email</th>
                            <th className="p-2">Vai trò</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="text-center border-b">
                                <td className="p-2 ">
                                    <img src={user.avatar} alt={user.username}     className="w-10 h-10 rounded-full object-cover mx-auto"
 />
                                </td>
                                <td className="p-2 text-left">{user.username}</td>
                                <td className="p-2 text-left">{user.email}</td>
                                <td className="p-2 ">{user.role}</td>
                                <td className="p-2  space-x-2">
                                    <div className="flex items-center justify-center">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="p-1 bg-yellow-100 rounded hover:bg-yellow-200 ml-2"
                                        username="Chỉnh sửa"
                                    >
                                        <PencilIcon className="h-5 w-5 text-yellow-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowConfirm(true)}
                                        }
                                        className="p-1 bg-red-100 rounded hover:bg-red-200 ml-2"
                                        username="Xoá"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-600" />
                                    </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {( isEditing) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{'Chỉnh sửa người dùng ' + selectedUser.username}</h3>

                <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="name">Tên người dùng</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="phone">Số điện thoại</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="address">Địa chỉ</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="role">Vai trò</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        >
                            <option value="" disabled>Chọn vai trò</option>
                            {['Reader', 'Admin'].map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="avatar">URL ảnh đại diện</label>
                        <input
                            id="avatar"
                            type="text"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {isEditing ? 'Lưu thay đổi' : 'Thêm'}
                        </button>
                    </div>
                </form>
                    </div>
                </div>
            )}

            {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xoá sách</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xoá cuốn sách này không?</p>
            <div className="flex justify-end gap-2 sm:gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                    handleDeleteUser(selectedUser._id);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
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

export default UserCRUDTable;
