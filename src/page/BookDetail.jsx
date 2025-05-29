import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Alert from '../component/Alert';
import { getBookById, borrowBook } from '../API/apiCaller';

const BookDetail = () => {
    const user = useSelector((state) => state.user.currentUser);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        Alert.error('Không thể tải thông tin sách!');
      }
    };

    fetchBook();
  }, [id]);

  const handleBorrowRequest = () => {

    if (!user) {
        setAlert({ message: 'Bạn cần đăng nhập để mượn sách!', type: 'error', id: Date.now() });
        return;
    }

    borrowBook(user._id, id, "reserved")
      .then(() => {
        setAlert({ message: 'Yêu cầu mượn sách đã được gửi!', type: 'success', id: Date.now() });
      })
      .catch((error) => {
        console.error("Lỗi khi gửi yêu cầu mượn sách:", error);
        setAlert({ message: 'Có lỗi xảy ra khi gửi yêu cầu mượn sách. Vui lòng thử lại sau.', type: 'error', id: Date.now() });
      });
  };

  if (!book) return <div>Đang tải...</div>;

  return (
    <div className="max-w-5xl min-h-screen mx-auto p-6 bg-white shadow rounded-lg">
      <div className="sm:flex gap-6">
        <img src={book.image} alt={book.title} className="w-48 h-72 object-cover rounded mr-4" />
        <div className="mt-4 sm:mt-0">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 my-2"><strong>Tác giả:</strong> {book.author}</p>
          <p className="text-gray-700 my-2"><strong>Thể loại:</strong> {book.category?.name || 'Không rõ'}</p>
          <p className="text-gray-700 my-2"><strong>Nhà xuất bản:</strong> {book.publisher}</p>
          <p className="text-gray-700 my-2"><strong>Năm xuất bản:</strong> {book.year}</p>
          <p className="text-gray-700 my-2"><strong>Số lượng còn:</strong> {book.stock}</p>
          <p className="text-gray-700 my-2"><strong>Lượt mượn:</strong> {book.borrowCount}</p>

          <button
            onClick={handleBorrowRequest}
            disabled={book.stock <= 0 }
            className={`mt-4 px-4 py-2 rounded text-white ${
              book.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {(book.stock <= 0 ? 'Hết sách' : 'Đặt mượn')}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Tóm tắt nội dung</h2>
        <p className="text-gray-800 leading-relaxed">
          {book.summary || 'Chưa có tóm tắt nội dung.'}
        </p>
      </div>

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

export default BookDetail;
