import { useSelector } from 'react-redux'; // nếu dùng Redux, hoặc truyền prop user

const UserInfo = ({ user }) => {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
      <div className="flex items-start gap-6">
        <div className="space-y-5">
          <p><span className="font-medium">Họ tên:</span> {user.name || 'Chưa cập nhật'}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Số điện thoại:</span> {user.phone || 'Chưa cập nhật'}</p>
          <p><span className="font-medium">Địa chỉ:</span> {user.address || 'Chưa cập nhật'}</p>
          <p><span className="font-medium">Vai trò:</span> {user.role}</p>
          <p><span className="font-medium">Số lượt mượn sách:</span> {user.borrowingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
