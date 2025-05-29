import { useState, useEffect } from 'react';

const EditProfileForm = ({ user, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = { name, email, phone, address, avatar}
        try {
            onSubmit(updatedUser);
        }
        catch (error) {
            setAlert({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau', type: 'error', id: Date.now() });
        }

    };

    return (
        <div className="mb-6">

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block font-medium mb-1">Họ tên</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Số điện thoại</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Địa chỉ</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">URL Ảnh đại diện</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Vai trò</label>
                    <input
                        type="text"
                        value={user.role}
                        disabled
                        className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Cập nhật
                </button>
            </form>
            
        </div>
    );
};

export default EditProfileForm;
