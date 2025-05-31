import SummaryCard from "../SummaryCard";
import { getAllBooks, getAllUsers, getAllBorrowings } from "../../API/apiCaller";
import { BookOpen, Clock, AlertCircle, Users, Library, Repeat, History, CalendarCheck } from "lucide-react";
import { BarChart, PieChart, Pie, Cell, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useState, useEffect, use } from "react";
const SummaryTab = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [borrowings, setBorrowings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksResponse = await getAllBooks({});
                const usersResponse = await getAllUsers({});
                const borrowingsResponse = await getAllBorrowings({});
                setBooks(booksResponse);
                setUsers(usersResponse);
                setBorrowings(borrowingsResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    //Hàm lấy 3 cuốn sách đc mượn nhiều nhất
    const getTopBorrowedBooks = (books) => {

        if (!Array.isArray(books) || books.length === 0) return [];
        // Sắp xếp sách theo số lượt mượn giảm dần
        const sortedBooks = [...books].sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0));
        // Lấy 3 cuốn sách đầu tiên
        return sortedBooks.slice(0, 3).map(book => ({
            title: book.title,
            borrowCount: book.borrowCount || 0
        }));

    };

    const topBorrowedBooks = getTopBorrowedBooks(books.books || []);

    const calculateTotalBook = (books) => {
        if (!Array.isArray(books)) return 0;
        return books.reduce((total, book) => total + book.stock, 0);
    };
    const totalBooksCount = books.totalBooks || 0; // tổng số đầu sách

    const totalUsers = users.totalUsers || 0; // tổng số người dùng
    const totalBorrowings = borrowings.totalBorrowings || 0; // tổng số lượt mượn


    const overdueCount = Array.isArray(borrowings.borrowings)
        ? borrowings.borrowings.filter(b => b.status === 'late').length
        : 0;

    const borrowedBooksCount = Array.isArray(borrowings.borrowings)
        ? borrowings.borrowings.filter(b => b.status === 'borrowed').length
        : 0;

    const reservedBooksCount = Array.isArray(borrowings.borrowings)
        ? borrowings.borrowings.filter(b => b.status === 'reserved').length
        : 0;

    const availableBooksCount = calculateTotalBook(books.books);

    const totalBooks = availableBooksCount + borrowedBooksCount + reservedBooksCount;



    return (
        <main className="flex-1 p-6 overflow-auto">
            {/* Tiêu đề */}
            <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>

            {/* Thống kê tổng */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard icon={<Library />} label="Tổng sách" value={totalBooks} />
                <SummaryCard icon={<BookOpen />} label="Số đầu sách" value={totalBooksCount} />
                <SummaryCard icon={<Clock />} label="Đang mượn" value={borrowedBooksCount} />
                <SummaryCard icon={<CalendarCheck />} label="Đang đặt" value={reservedBooksCount} />
                <SummaryCard icon={<History />} label="Tổng lượt mượn" value={totalBorrowings} />
                <SummaryCard icon={<AlertCircle className="text-red-500" />} label="Quá hạn" value={overdueCount} />
                <SummaryCard icon={<Users />} label="Người dùng" value={totalUsers} />
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Tình trạng sách</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie dataKey="value" data={[
                                { name: 'Đã mượn', value: borrowedBooksCount },
                                { name: 'Đặt trước', value: reservedBooksCount },
                                { name: 'Còn lại', value: availableBooksCount },
                            ]} label outerRadius={80}>
                                <Cell fill="#3b82f6" />
                                <Cell fill="#10b981" />
                                <Cell fill="#f59e0b" />
                            </Pie>
                            
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Lượt mượn theo tháng</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[
                            { name: 'T1', borrows: 40 },
                            { name: 'T2', borrows: 80 },
                            { name: 'T3', borrows: 65 },
                            { name: 'T4', borrows: 100 },
                        ]}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="borrows" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Danh sách nhanh */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-4">Sách được mượn nhiều nhất</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                    {topBorrowedBooks.map((book, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <span className="font-semibold">{book.title}</span>
                            <span className="text-gray-500">({book.borrowCount} lượt mượn)</span>
                        </li>
                    ))}
                </ul>
            </div>
        </main>

    );
}
export default SummaryTab;