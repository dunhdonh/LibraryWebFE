import React from 'react';

const BorrowedBookCard = ({ book, borrow, onCancel }) => {
    const [showConfirm, setShowConfirm] = React.useState(false);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const statusText = {
    reserved: 'Đã đặt',
    borrowed: 'Đang mượn',
    returned: 'Đã trả',
    late: 'Trễ hạn',
    cancelled: 'Đã hủy đặt',
  };

  const statusColor = {
    reserved: 'bg-yellow-100 text-yellow-700',
    borrowed: 'bg-blue-100 text-blue-700',
    returned: 'bg-green-100 text-green-700',
    late: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="flex w-full max-w-4xl mx-auto items-center p-2 sm:p-4 sm:mb-4 rounded-xl shadow-sm bg-white border border-gray-200">
      <img
        src={book.image}
        alt={book.title}
        className="w-20 h-28 sm:w-28 sm:h-40 object-cover rounded-lg mr-4"
      />
      <div className="flex flex-col justify-between flex-1">
        <h3 className="text-l sm:text-xl font-semibold text-gray-800">{book.title}</h3>      
        {borrow.status === 'reserved' ? (
          <>
            <p className="text-xs sm:text-sm text-gray-600">Ngày đặt: {formatDate(borrow.borrowDate)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Hạn lấy: {formatDate(borrow.dueDate)}</p>
          </>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-600">Ngày mượn: {formatDate(borrow.borrowDate)}</p>
            <p className="text-xs sm:text-sm text-gray-600">Hạn trả: {formatDate(borrow.dueDate)}</p>
          </>
        )}

        <div className="flex items-center justify-between mt-3">
          <span
            className={`inline-block px-3 py-1 text-xs sm:text-sm rounded-full ${statusColor[borrow.status]}`}
          >
            {statusText[borrow.status]}
          </span>

          {borrow.status === 'reserved' && (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-1.5 text-xs sm:text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Huỷ
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Xác nhận huỷ đặt</h2>
            <p className="mb-6">Bạn có chắc chắn muốn huỷ đặt cuốn sách này không?</p>
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
                  onCancel?.();
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBookCard;
