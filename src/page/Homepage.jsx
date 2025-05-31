import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import BookCard from '../component/BookCard'; 
import { getAllBooks} from '../API/apiCaller';
import React from 'react';

const HomePage = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    const [newBooks, setNewBooks] = React.useState([]);
    React.useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks({});
                setNewBooks(data.books.slice(-8).reverse()); // Lấy 8 sách mới nhất
            } catch (error) {
                console.error("Lỗi khi lấy sách:", error);
            }
        };
        fetchBooks();
    }, []);


    return (
        <div className="min-h-screen bg-white flex flex-col mt-2 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Slide ảnh */}
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}

                    interval={3000}
                    className="overflow-hidden shadow-lg "
                >
                    <div>
                        <img src="https://atd-bloges.s3.us-east-2.amazonaws.com/wp-content/uploads/2022/03/16132227/banner-graphic-1.webp"
                            className="h-[300px] object-cover w-full object-center rounded-lg"
                            alt="Thư viện 0" />
                    </div>
                    <div>
                        <img src="https://marketplace.canva.com/EAF4n2WuNKc/2/0/1600w/canva-h%E1%BB%93ng-pastel-%C4%91en-n%E1%BB%95i-b%E1%BA%ADt-c%E1%BB%ADa-h%C3%A0ng-s%C3%A1ch-banner-JUT8DwjmSUI.jpg"
                            className="h-[300px] object-cover w-full object-center rounded-lg"
                            alt="Thư viện 1" />
                    </div>
                    <div>
                        <img src="https://lic.huc.edu.vn/wp-content/uploads/2024/02/Book-Banner.jpg"
                            className="h-[300px] object-cover w-full object-center rounded-lg"
                            alt="Thư viện 2" />
                    </div>
                    <div>
                        <img src="https://anh.24h.com.vn/upload/3-2015/images/2015-09-23/1443004119-1442912203-anh-4.jpg"
                            className="h-[300px] object-cover w-full object-center rounded-lg"
                            alt="Thư viện 3" />
                    </div>
                    <div>
                        <img src="https://thietkelogo.edu.vn/uploads/images/thiet-ke-do-hoa-khac/banner-sach/1.png"
                            className="h-[300px] object-cover w-full object-center rounded-lg"
                            alt="Thư viện 4" />
                    </div>
                </Carousel>

                {/* Giới thiệu thư viện */}
                <div className="mt-10  mb-10">
                    <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Chào bạn đến với Bookio – nơi những cuốn sách tự do lên đường cùng bạn.
                        Với hàng ngàn đầu sách đủ thể loại, từ học thuật đến giải trí, bạn có thể thoải mái mượn hoàn toàn miễn phí.
                    </p>

                    {!isLoggedIn && (
                        <p className="text-gray-700 leading-relaxed mt-4">
                            <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                Đăng nhập
                            </Link>{' '} để đặt mượn sách ngay hôm nay và khám phá thế giới tri thức vô tận nhé.
                        </p>
                    )}

                    <h2 className="text-2xl font-bold mb-4 mt-6">Sách mới</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {newBooks.map((book) => (
                            <BookCard
                                book = {book}
                                key={book._id}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HomePage;
