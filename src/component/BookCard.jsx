import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
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
                <div className="flex flex-col justify-between flex-1 sm:min-h-[120px] w-full">
                    <div>
                        <h3 className="text-base font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600">Tác giả: {book.author}</p>
                        <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${getCategoryColor(book.category?.name)}`}>
                            {book.category?.name || 'Không rõ'}
                        </p>                        <p className="text-sm text-gray-500 mt-1">Lượt mượn: {book.borrowCount || 0}</p>
                        <Link to={`/book/${book._id}`} className="text-blue-600 hover:underline text-sm mt-1 inline-block">
                            Xem chi tiết
                        </Link>
                    </div>

        

                </div>

            </div>
        </div>
    );
};

export default BookCard;
