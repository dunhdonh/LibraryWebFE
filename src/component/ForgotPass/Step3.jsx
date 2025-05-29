import React from 'react'
import { useState } from 'react';

const Step3 = ({ onReset }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    onReset(password); // Gửi mật khẩu mới tới API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold">Tạo mật khẩu mới</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="password"
        placeholder="Mật khẩu mới"
        className="w-full px-3 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        className="w-full px-3 py-2 border rounded"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">Cập nhật mật khẩu</button>
    </form>
  );
};
export default Step3;