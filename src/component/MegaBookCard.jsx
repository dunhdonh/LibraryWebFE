import { Link } from 'react-router-dom';

const MegaBookCard = ({ book }) => {
    const handleBorrow = () => {
        alert(`Đã gửi yêu cầu mượn sách: ${book.title}`);
    };

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'học thuật':
                return 'bg-green-200 text-green-800';
            case 'tiểu thuyết':
                return 'bg-blue-200 text-blue-800';
            case 'kinh tế':
                return 'bg-yellow-200 text-yellow-800';
            case 'lịch sử':
                return 'bg-red-200 text-red-800';
            case 'truyện thiếu nhi':
                return 'bg-purple-200 text-purple-800';
            case 'lập trình':
                return 'bg-teal-200 text-teal-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg w-full max-w-md mx-auto 
                        flex md:w-56 md:block">
            {/* Flex theo hàng ngang khi dưới sm */}
            <div className="flex sm:block">
                {/* Ảnh bên trái khi nhỏ */}
                <div className="w-28 h-max  flex-shrink-0 sm:w-max sm:h-48 mb-3 sm:mb-3 mr-4 sm:mr-0">
                    <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                    />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex flex-col justify-between flex-1 sm:min-h-[215px] w-full">
                    <div>
                        <h3 className="text-base font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600">Tác giả: {book.author}</p>
                        <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${getCategoryColor(book.category?.name)}`}>
                            {book.category?.name || 'Không rõ'}
                        </p>                        <p className="text-sm text-gray-500 mt-1">Lượt mượn: {book.borrowCount || 0}</p>
                        <p className={`text-sm mt-1 ${book.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            Còn: {book.stock} cuốn
                        </p>
                        <Link to={`/book/${book._id}`} className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                            Xem chi tiết
                        </Link>
                    </div>

                    {/* Nút ở dưới cùng */}
                    <div className='flex justify-start'>
                        <button
                            onClick={handleBorrow}
                            disabled={book.stock === 0}
                            className={`mt-3 py-1.5 rounded text-white text-sm transition w-40
                                    ${book.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            Đặt mượn
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MegaBookCard;
