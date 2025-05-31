import React, { useEffect, useState } from 'react';
import { getAllBooks, getAllCategories, borrowBook } from '../API/apiCaller'; 
import MegaBookCard from '../component/MegaBookCard'; 
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../component/Alert';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [alert, setAlert] = useState(null);

  const [user, setUser] = useState(useSelector((state) => state.user.currentUser));
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    }
  }, [token, dispatch]);

  const handleBorrowBook = (bookId) => {
    if (!user) {
      setAlert({
        id: Date.now(),
        message: 'Bạn cần đăng nhập để mượn sách.',
        type: 'error',
      });
      return;
    }
    borrowBook(user._id, bookId, 'reserved')
      .then(() => {
        setAlert({
          id: Date.now(),
          message: 'Yêu cầu mượn sách đã được gửi thành công!',
          type: 'success',
        });
      })
      .catch((error) => {
        console.error('Lỗi khi gửi yêu cầu mượn sách:', error);
        setAlert({
          id: Date.now(),
          message: 'Có lỗi xảy ra khi gửi yêu cầu mượn sách. Vui lòng thử lại sau.',
          type: 'error',
        });
      });
  };


  const fetchBooks = async () => {
    try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
      const response = await getAllBooks(params); // ví dụ: gọi API
      setBooks(response.books);
    } catch (err) {
      console.error('Lỗi lấy sách:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl min-h-screen mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Tất cả sách </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên sách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">-- Tất cả thể loại --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.length > 0 ? (
          books.map((book) => <MegaBookCard 
          key={book._id} 
          book={book} 
          onBorrow={() => handleBorrowBook(book._id)}
          />)
        ) : (
          <p className="text-gray-500">Không tìm thấy sách nào.</p>
        )}
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

export default AllBooks;
