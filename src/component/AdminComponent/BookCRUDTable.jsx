import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getAllBooks, getAllCategories, addBook, updateBook, deleteBook } from '../../API/apiCaller';
import { useEffect } from 'react';
import Alert from '../Alert';
const BookCRUDTable = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [booksArray, setBooksArray] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({ title: '', author: '', publisher: '', year: '', stock: '', image: '', categoryName: '', summary: '' });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks({});
                setBooksArray(data.books);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        };
        fetchBooks();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data.categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({ title: '', author: '', publisher: '', year: '', stock: '', image: '', categoryName: '', summary: '' });
    };

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setFormData({ title: book.title, author: book.author, publisher: book.publisher, year: book.year, stock: book.stock, image: book.image, categoryName: book.category.name, summary: book.summary });
        setIsEditing(true);
    };

    const handleDeleteBook = (bookId) => {
            deleteBook(bookId)
                .then(() => {
                    setBooksArray(booksArray.filter(book => book._id !== bookId));
                    console.log("Book deleted successfully");
                    setAlert({
                        id: Date.now(),
                        message: "Xoá sách thành công",
                        type: "success"
                    });
                })
                .catch((error) => {
                    console.error("Error deleting book:", error);
                    setAlert({
                        id: Date.now(),
                        message: "Xoá sách thất bại",
                        type: "error"
                    });
                });
    };

    const handleFormSubmit = (e) => {
        console.log("Form data submitted:", formData);
        e.preventDefault();
        if (isEditing) {
            updateBook(selectedBook._id, formData)
                .then((updatedBook) => {
                    setBooksArray(booksArray.map(book => book._id === updatedBook._id ? updatedBook : book));
                    setIsEditing(false);
                    setSelectedBook(null);
                    setAlert({
                        id: Date.now(),
                        message: "Cập nhật sách thành công",
                        type: "success"
                    });
                })
                .catch((error) => {
                    console.error("Error updating book:", error);
                    setAlert({
                        id: Date.now(),
                        message: "Cập nhật sách thất bại",
                        type: "error"
                    });
                });
        } else {
            addBook(formData)
                .then((newBook) => {
                    setBooksArray([...booksArray, newBook]);
                    setIsAdding(false);
                    setAlert({
                        id: Date.now(),
                        message: "Thêm sách thành công",
                        type: "success"
                    });
                })
                .catch((error) => {
                    console.error("Error adding book:", error);
                    setAlert({
                        id: Date.now(),
                        message: "Thêm sách thất bại",
                        type: "error"
                    });
                });
        }

    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsAdding(false);
        setSelectedBook(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách sách</h2>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Thêm sách
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2"></th>
                            <th className="p-2">Tên sách</th>
                            <th className="p-2">Tác giả</th>
                            <th className="p-2">Số lượng</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {booksArray.map((book) => (
                            <tr key={book._id} className="text-center border-b">
                                <td className="p-2 ">
                                    <img src={book.image} alt={book.title} className="h-16 mx-auto object-cover" />
                                </td>
                                <td className="p-2 ">{book.title}</td>
                                <td className="p-2 ">{book.author}</td>
                                <td className="p-2 ">{book.stock}</td>
                                <td className="p-2  space-x-2">
                                    <button
                                        onClick={() => handleEditClick(book)}
                                        className="p-1 bg-yellow-100 rounded hover:bg-yellow-200 ml-2"
                                        title="Chỉnh sửa"
                                    >
                                        <PencilIcon className="h-5 w-5 text-yellow-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setShowConfirm(true)}
                                        }
                                        className="p-1 bg-red-100 rounded hover:bg-red-200 ml-2"
                                        title="Xoá"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-600" />
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(isAdding || isEditing) && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</h3>

                <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="title">Tên sách</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="author">Tác giả</label>
                        <input
                            id="author"
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="publisher">NXB</label>
                        <input
                            id="publisher"
                            type="text"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="year">Năm</label>
                        <input
                            id="year"
                            type="text"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="stock">Số lượng</label>
                        <input
                            id="stock"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="categoryName">Thể loại</label>
                        <select
                            id="categoryName"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        >
                            <option value="" disabled>Chọn thể loại</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="image">URL ảnh bìa</label>
                        <input
                            id="image"
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
                            required
                        />
                    </div>

                    <div >
                        <label className="block mb-1 font-medium text-sm" htmlFor="summary">Tóm tắt nội dung</label>
                        <input
                            id="summary"
                            type="Text"
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border"
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
                    handleDeleteBook(selectedBook._id);
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

export default BookCRUDTable;
