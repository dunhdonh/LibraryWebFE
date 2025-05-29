import { useEffect, useState } from 'react';

const Alert = ({ message, type = 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  const onClose = () => setVisible(false);

  useEffect(() => {
  const timeout = setTimeout(() => {
    setVisible(false);
    onClose?.(); // Xoá alert ở parent
  }, duration);
  return () => clearTimeout(timeout);
}, [duration]);

  if (!visible) return null;

  const typeClasses = {
    success: 'bg-green-100 text-green-700 border-green-400',
    error: 'bg-red-100 text-red-700 border-red-400',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
    info: 'bg-blue-100 text-blue-700 border-blue-400',
  };

  return (
    <div
  className={`
    fixed bottom-6 right-6 z-50
    max-w-xs w-full
    border
    rounded-lg
    px-5 py-4
    shadow-lg
    flex items-center
    space-x-3
    ${typeClasses[type]}
  `}
  role="alert"
>
  <strong className="font-semibold capitalize">{type}!</strong>
  <span className="flex-1 text-sm">{message}</span>
  <button
    onClick={() => setVisible(false)}
    className="text-gray-700 hover:text-gray-900 transition duration-200 ease-in-out focus:outline-none"
    aria-label="Close notification"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>
  );
};

export default Alert;
