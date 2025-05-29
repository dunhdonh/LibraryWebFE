import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '../component/Alert';
import BorrowedBookCard from '../component/BorrowedBookCard';
import { getBorrowedBooks, updateBorrowingStatus } from '../API/apiCaller';

const BorrowingList = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [alert, setAlert] = useState(null);
    const [reservedBooks, setReservedBooks] = useState([]);

    const handleCancelReservation = async (borrowId) => {
        try {
            console.log("Cancelling reservation for borrow ID:", borrowId);
            await updateBorrowingStatus(borrowId, "cancelled");
            setReservedBooks((prev) => prev.filter((borrow) => borrow._id !== borrowId));
            setAlert({ message: 'Đã hủy đặt sách thành công!', type: 'success', id: Date.now() });
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            setAlert({ message: 'Không thể hủy đặt sách. Vui lòng thử lại sau.', type: 'error', id: Date.now() });
        }
    }

    useEffect(() => {
        if (!user || !user._id) return;
        const fetchReservedBooks = async () => {
            try {
                const data = await getBorrowedBooks(user._id, 'borrowed');
                console.log("Reserved Books Data:", data);
                setReservedBooks(data);

            } catch (error) {
                console.error("Lỗi khi tải sách đã đặt:", error);
                setAlert({ message: 'Không thể tải sách đã đặt. Vui lòng thử lại sau.', type: 'error', id: Date.now() });
            }
        };  

        fetchReservedBooks();
    }, [user]);




    return (
        <div className="max-w-5xl min-h-screen mx-auto p-6 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Sách đang mượn</h1>

            {reservedBooks.length === 0 ? (
                <p className="text-gray-700">Bạn chưa mượn cuốn sách nào. Mau đặt đi :3.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reservedBooks.map((borrow) => (
                    <BorrowedBookCard 
                    key={borrow._id}
                    borrow={borrow} 
                    book={{
                        title: borrow.bookId.title, image: borrow.bookId.image 
                    }} 
                    onCancel={() => handleCancelReservation(borrow._id)}
                    />
                ))}

                </div>
            )}

            {alert && (
                <Alert
                    key={alert.id}
                    message={alert.message}
                    type={alert.type}
                />
            )}

        </div>
    );
};

export default BorrowingList;
