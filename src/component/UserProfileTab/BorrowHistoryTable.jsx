import React from 'react';

const BorrowHistoryTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Lịch sử mượn</h1>
      <table className="min-w-full text-sm text-left border rounded shadow">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">Ảnh</th>
            <th className="p-3">Tên sách</th>
            <th className="p-3">Ngày mượn</th>
            <th className="p-3">Ngày trả</th>
            <th className="p-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item._id || idx} className="border-t">
              <td className="p-3">
                <img
                  src={item.bookId.image}
                  alt={item.bookId.title}
                  className="w-12 h-16 object-cover rounded"
                />
              </td>
              <td className="p-3 font-medium">{item.bookId.title}</td>
              <td className="p-3">{new Date(item.borrowDate).toLocaleDateString()}</td>
              <td className="p-3">{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '—'}</td>
              <td className="p-3 capitalize">
                <span
                  className={`px-2 py-1 rounded text-white ${item.status === 'returned'
                      ? 'bg-green-500'
                      : item.status === 'overdue'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowHistoryTable;
