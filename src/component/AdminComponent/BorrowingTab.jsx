import React, { use, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getAllBorrowings, updateBorrowingStatus, borrowBook, deleteBorrowing, getBooksByTitle, getUserByUsername } from '../../API/apiCaller';
import { useEffect } from 'react';
import Alert from '../Alert';
const BorrowingTab = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState(null);
    const [borrowingsArray, setBorrowingsArray] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({ userId: '', bookId: '', borrowDate: '', dueDate: '', status: '' });
    const [usernameSearch, setUsernameSearch] = useState('');
    const [debounceUsernameSearch, setDebounceUsernameSearch] = useState('');
    const [bookSearch, setBookSearch] = useState('');
    const [debounceBookSearch, setDebounceBookSearch] = useState('');

    const [usersres, setUsers] = useState([]);
    const [booksres, setBooks] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    const [showUserSuggestions, setShowUserSuggestions] = useState(false);
    const [showBookSuggestions, setShowBookSuggestions] = useState(false);

    const [isSelectingUser, setIsSelectingUser] = useState(false);
    const [isSelectingBook, setIsSelectingBook] = useState(false);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };
    // Set timeout để tránh việc gọi API quá nhiều lần khi người dùng gõ nhanh
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebounceUsernameSearch(usernameSearch);
        }, 200);
        return () => clearTimeout(handle);
    }, [usernameSearch]);

    useEffect(() => {
        const handle = setTimeout(() => {
            setDebounceBookSearch(bookSearch);
        }, 200);
        return () => clearTimeout(handle);
    }, [bookSearch]);

    // gọi API để lấy danh sách người dùng và sách khi có thay đổi trong tìm kiếm
    useEffect(() => {
        if (!debounceBookSearch) return;
        const fetchBooks = async () => {
            if (!isSelectingBook && bookSearch.length > 0) {
                try {
                    const data = await getBooksByTitle(debounceBookSearch);
                    setBooks(data);
                } catch (error) {
                    console.error("Failed to fetch books:", error);
                }
            }
            setIsSelectingBook(false);

        };
        fetchBooks();
    }, [debounceBookSearch]);

    useEffect(() => {
        if (!debounceUsernameSearch) return;
        const fetchUsers = async () => {
            if (!isSelectingUser && usernameSearch.length > 0) {
                try {
                    const data = await getUserByUsername(debounceUsernameSearch);
                    setUsers(data);
                    console.log("Fetched users:", data);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                }
            }
            setIsSelectingUser(false);

        };
        fetchUsers();
    }, [debounceUsernameSearch]);


    useEffect(() => {
        const fetchBorrowings = async () => {
            try {
                const data = await getAllBorrowings();
                setBorrowingsArray(data.borrowings);
                console.log("Fetched borrowings:", data);
            } catch (error) {
                console.error("Failed to fetch borrowings:", error);
            }
        };
        fetchBorrowings();
    }, []);


    const handleAddClick = () => {
        setSelectedBorrowing(null);
        setFormData({
            userId: '',
            bookId: '',
            borrowDate: new Date().toISOString().split('T')[0], // Set default to today
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Set default to 14 days later
            status: 'borrowed' // Default status
        });
        setIsAdding(true);
    };

    const handleDeleteBorrowing = (borrowingId) => {
        deleteBorrowing(borrowingId)
            .then(() => {
                setBorrowingsArray(borrowingsArray.filter(borrowing => borrowing._id !== borrowingId));
                console.log("Borrowing deleted successfully");
                setAlert({
                    id: Date.now(),
                    message: "Xoá đơn mượn thành công",
                    type: "success"
                });
            })
            .catch((error) => {
                console.error("Error deleting borrowing:", error);
                setAlert({
                    id: Date.now(),
                    message: "Xoá đơn mượn thất bại",
                    type: "error"
                });
            });
    };

    const handleUpdateBorrowingStatus = (borrowingId, newStatus) => {
        updateBorrowingStatus(borrowingId, newStatus)
            .then((updatedBorrowing) => {
                setBorrowingsArray(borrowingsArray.map(borrowing => borrowing._id === borrowingId ? updatedBorrowing : borrowing));
                console.log("Borrowing status updated successfully");
                setAlert({
                    id: Date.now(),
                    message: "Cập nhật trạng thái đơn mượn thành công",
                    type: "success"
                });
            })
            .catch((error) => {
                console.error("Error updating borrowing status:", error);
                setAlert({
                    id: Date.now(),
                    message: "Cập nhật trạng thái đơn mượn thất bại",
                    type: "error"
                });
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        formData.userId = selectedUser?._id;
        formData.bookId = selectedBook?._id;
        console.log("Form data submitted:", formData);
        if (!formData.userId || !formData.bookId) {
            setAlert({
                id: Date.now(),
                message: "Vui lòng chọn người dùng và sách trước khi tạo đơn mượn",
                type: "error" 
            });
            return;
        }

        if (new Date(formData.dueDate) < new Date(formData.borrowDate)) {
            setAlert({
                id: Date.now(),
                message: "Hạn trả không thể trước ngày mượn",
                type: "error"
            });
            return;
        }
        const borrowingData = formData;
        console.log("Submitting borrowing data:", borrowingData);
        borrowBook(borrowingData.userId, borrowingData.bookId, borrowingData.status, borrowingData.borrowDate, borrowingData.dueDate)
            .then((newBorrowing) => {
                setBorrowingsArray([...borrowingsArray, newBorrowing]);
                setIsAdding(false);
                setSelectedBorrowing(null);
                setAlert({
                    id: Date.now(),
                    message: "Tạo đơn mượn thành công",
                    type: "success"
                });
            })
            .catch((error) => {
                console.error("Error creating borrowing:", error);
                setAlert({
                    id: Date.now(),
                    message: "Tạo đơn mượn thất bại",
                    type: "error"
                });
            });
        setUsernameSearch('');
        setBookSearch('');
        setSelectedUser(null);
        setSelectedBook(null);
        setShowUserSuggestions(false);
        setShowBookSuggestions(false);
        setIsSelectingUser(false);
        setIsSelectingBook(false);
        setFormData({
            userId: '',
            bookId: '',
            borrowDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
            status: 'borrowed'
        });
        setShowConfirm(false);
        setSelectedBorrowing(null);
        setIsAdding(false);

    };

    const handleCancel = () => {
        setIsAdding(false);
        setSelectedBorrowing(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách đơn mượn</h2>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-blue-600"
                >
                    Tạo đơn
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr className="text-left border-b">
                            <th className="p-2">ID</th>
                            <th className="p-2 min-w-36">Tên sách</th>
                            <th className="p-2 min-w-36">Người mượn</th>
                            <th className="p-2">Ngày đặt</th>
                            <th className="p-2">Hạn</th>
                            <th className="p-2 min-w-24">Trạng thái</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowingsArray.map((borrowing) => (
                            <tr key={borrowing._id} className="text-left border-b">
                                <td className="p-1 ">
                                    #{borrowing._id.toString().slice(-6)}
                                </td>
                                <td className="p-2 ">{borrowing.bookId?.title ?? "không rõ"}</td>
                                <td className="p-2 ">{borrowing.userId.name}</td>
                                <td className="p-2 ">{formatDate(borrowing.borrowDate)}</td>
                                <td className="p-2 ">{formatDate(borrowing.dueDate)}</td>
                                <td className="p-2">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${borrowing.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' :
                                            borrowing.status === 'returned' ? 'bg-green-100 text-green-800' :
                                                borrowing.status === 'late' ? 'bg-red-100 text-red-800' :
                                                    borrowing.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                                                        borrowing.status === 'cancelled' ? 'bg-gray-200 text-gray-800' :
                                                            'bg-neutral-100 text-neutral-800'
                                            }`}
                                    >
                                        {
                                            borrowing.status === 'borrowed' ? 'Mượn' :
                                                borrowing.status === 'returned' ? 'Đã trả' :
                                                    borrowing.status === 'late' ? 'Trễ' :
                                                        borrowing.status === 'reserved' ? 'Đã đặt' :
                                                            borrowing.status === 'cancelled' ? 'Huỷ' :
                                                                'Không rõ'
                                        }
                                    </span>
                                </td>

                                <td >
                                    <div className="py-2 justify-end flex space-x-2">
                                        {
                                        borrowing.status == 'borrowed' && (
                                            <button  
                                                onClick={() => {
                                                    setSelectedBorrowing(borrowing);
                                                    handleUpdateBorrowingStatus(borrowing._id, 'returned');
                                                }}
                                                className="p-1 bg-blue-500 rounded hover:bg-blue-600 ml-2 w-12 text-white">
                                            Trả
                                            </button>
                                        )
                                    }

                                    {
                                        borrowing.status == 'reserved' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedBorrowing(borrowing);
                                                    handleUpdateBorrowingStatus(borrowing._id, 'borrowed');
                                                }}
                                                className="p-1 bg-green-500 rounded hover:bg-green-600 ml-2 w-12 text-white">
                                                Lấy
                                            </button>
                                        )
                                    }
                                    <button
                                        onClick={() => {
                                            setSelectedBorrowing(borrowing);
                                            setShowConfirm(true)
                                        }
                                        }
                                        className="p-1 bg-red-100 rounded hover:bg-red-200"
                                        borrowingname="Xoá"
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

            {(isAdding) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Tạo đơn mượn</h3>

                        <form onSubmit={handleFormSubmit} className="space-y-3">
                            <div className = "relative" >
                                <label className="block mb-1 font-medium text-sm">Người mượn</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded mb-2"
                                    placeholder="Nhập username..."
                                    value={usernameSearch}
                                    onClick={(e) => {
                                        setShowBookSuggestions(false);
                                    }}
                                    onChange={(e) => {
                                        setUsernameSearch(e.target.value);
                                        setShowUserSuggestions(e.target.value.length > 0);
                                    }
                                    }
                                />

                                {showUserSuggestions && <ul className="bg-white border rounded max-h-32 overflow-y-auto mb-3 absolute w-full z-10">
                                    {usersres?.map((u) => (
                                        <li
                                            key={u._id}
                                            className={`p-2 hover:bg-blue-100 cursor-pointer ${selectedUser?._id === u._id ? 'bg-blue-200' : ''}`}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setShowUserSuggestions(false);
                                                setUsernameSearch(u.username);
                                                setIsSelectingUser(true);
                                            }}
                                        >
                                            {u.username} ({u.email})
                                        </li>
                                    ))}
                                </ul>}

                                {/* Tìm sách */}
                                <label className="block mb-1 font-medium text-sm">Sách</label>
                                <input
                                    type="text"
                                    className="border p-2 w-full rounded mb-2"
                                    placeholder="Nhập tên sách..."
                                    value={bookSearch}
                                    onClick={(e) => {
                                        setShowUserSuggestions(false);
                                    }}
                                    onChange={(e) => {
                                        setBookSearch(e.target.value);
                                        setShowBookSuggestions(e.target.value.length > 0);
                                    }}
                                />
                                {showBookSuggestions && <ul className="bg-white border rounded max-h-32 overflow-y-auto mb-3 absolute">
                                    {booksres?.map((b) => (
                                        <li
                                            key={b._id}
                                            className={`p-2 hover:bg-blue-100 cursor-pointer ${selectedBook?._id === b._id ? 'bg-blue-200' : ''}`}
                                            onClick={() => {
                                                setSelectedBook(b);
                                                setShowBookSuggestions(false);
                                                setBookSearch(b.title);
                                                setIsSelectingBook(true);
                                            }}
                                        >
                                            {b.title}
                                        </li>
                                    ))}
                                </ul>}

                                {/* Ngày mượn */}
                                <label className="block mb-1 font-medium text-sm">Ngày mượn</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded mb-3"
                                    value={formData.borrowDate}
                                    onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                                />

                                {/* Hạn trả */}
                                <label className="block mb-1 font-medium text-sm">Hạn trả</label>
                                <input
                                    type="date"
                                    className="border p-2 w-full rounded mb-3"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />

                                {/* Trạng thái */}
                                <label className="block mb-1 font-medium text-sm">Trạng thái</label>
                                <select
                                    className="border p-2 w-full rounded mb-4"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="reserved">Đã đặt</option>
                                    <option value="borrowed">Mượn</option>
                                    <option value="returned">Đã trả</option>
                                    <option value="late">Trễ</option>
                                    <option value="cancelled">Đã huỷ</option>
                                </select>
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
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Xác nhận xoá đơn mượn</h2>
                        <p className="mb-6">Bạn có chắc chắn muốn xoá đơn mượn này không?</p>
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
                                    handleDeleteBorrowing(selectedBorrowing._id);
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

export default BorrowingTab;
